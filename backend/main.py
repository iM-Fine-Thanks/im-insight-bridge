from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import get_db
from crud import get_company_by_search
from schemas import CompanyOverviewResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/companies/overview", response_model=CompanyOverviewResponse)
def get_company_overview(
    searchType: str,
    searchValue: str,
    db: Session = Depends(get_db)
):
    company = get_company_by_search(db, searchType, searchValue)

    if not company:
        return {
            "serviceLevel": "UNAVAILABLE",
            "serviceMessage": "조회 가능한 기업 정보가 없습니다.",
            "companyOverview": None
        }

    if company.service_level == "FULL":
        return {
            "serviceLevel": "FULL",
            "serviceMessage": company.service_message or "공시 기반 재무 및 기업정보 제공 대상입니다.",
            "companyOverview": {
                "corpCode": company.corp_code,
                "corpName": company.corp_name,
                "ceoName": company.ceo_nm,
                "industryName": company.industry_name,
                "businessItem": company.business_item,
                "bizrNo": company.bizr_no,
                "jurirNo": company.jurir_no,
                "stockCode": company.stock_code,
                "marketCode": company.market_code,
                "estDate": company.est_dt,
                "listingDate": company.listing_dt,
            }
        }

    if company.service_level == "BASIC":
        return {
            "serviceLevel": "BASIC",
            "serviceMessage": company.service_message or "기본 기업정보만 제공 가능한 대상입니다.",
            "companyOverview": {
                "corpCode": company.corp_code,
                "corpName": company.corp_name,
                "ceoName": company.ceo_nm,
                "industryName": company.industry_name,
                "businessItem": company.business_item,
                "bizrNo": company.bizr_no,
                "jurirNo": company.jurir_no,
                "stockCode": company.stock_code,
                "marketCode": company.market_code,
                "estDate": company.est_dt,
                "listingDate": company.listing_dt,
            }
        }

    if company.service_level == "MINIMAL":
        return {
            "serviceLevel": "MINIMAL",
            "serviceMessage": company.service_message or "최소 기업정보만 제공 가능한 대상입니다.",
            "companyOverview": {
                "corpCode": company.corp_code,
                "corpName": company.corp_name,
                "ceoName": company.ceo_nm,
                "industryName": company.industry_name,
                "businessItem": None,
                "bizrNo": company.bizr_no,
                "jurirNo": company.jurir_no,
                "stockCode": None,
                "marketCode": None,
                "estDate": None,
                "listingDate": None,
            }
        }

    return {
        "serviceLevel": "UNAVAILABLE",
        "serviceMessage": company.service_message or "현재 제공 가능한 상세 정보가 없습니다.",
        "companyOverview": {
            "corpCode": company.corp_code,
            "corpName": company.corp_name,
            "ceoName": None,
            "industryName": None,
            "businessItem": None,
            "bizrNo": company.bizr_no,
            "jurirNo": company.jurir_no,
            "stockCode": None,
            "marketCode": None,
            "estDate": None,
            "listingDate": None,
        }
    }