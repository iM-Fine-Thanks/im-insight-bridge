from pydantic import BaseModel
from typing import Optional


class CompanyOverview(BaseModel):
    corpCode: Optional[str] = None
    corpName: Optional[str] = None
    ceoName: Optional[str] = None
    industryName: Optional[str] = None
    businessItem: Optional[str] = None
    bizrNo: Optional[str] = None
    jurirNo: Optional[str] = None
    stockCode: Optional[str] = None
    marketCode: Optional[str] = None
    estDate: Optional[str] = None
    listingDate: Optional[str] = None


class CompanyOverviewResponse(BaseModel):
    serviceLevel: str
    serviceMessage: str
    companyOverview: Optional[CompanyOverview] = None