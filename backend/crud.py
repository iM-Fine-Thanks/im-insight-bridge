import re
from sqlalchemy.orm import Session
from models import CorpIdentifierMap


def normalize_number(value: str) -> str:
    return re.sub(r"[^0-9]", "", value)


def get_company_by_search(db: Session, search_type: str, search_value: str):
    normalized = normalize_number(search_value)

    if search_type == "BIZR_NO":
        return (
            db.query(CorpIdentifierMap)
            .filter(
                CorpIdentifierMap.is_active == True,
                CorpIdentifierMap.bizr_no_norm == normalized
            )
            .first()
        )

    if search_type == "JURIR_NO":
        return (
            db.query(CorpIdentifierMap)
            .filter(
                CorpIdentifierMap.is_active == True,
                CorpIdentifierMap.jurir_no_norm == normalized
            )
            .first()
        )

    return None