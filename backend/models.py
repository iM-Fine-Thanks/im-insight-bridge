from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, text
from database import Base


class CorpIdentifierMap(Base):
    __tablename__ = "corp_identifier_map"

    id = Column(BigInteger, primary_key=True, index=True)
    corp_code = Column(String(20), nullable=False, unique=True)
    corp_name = Column(String(200), nullable=False)
    stock_code = Column(String(20))
    jurir_no = Column(String(20))
    bizr_no = Column(String(20))
    jurir_no_norm = Column(String(20))
    bizr_no_norm = Column(String(20))
    corp_name_norm = Column(String(200))
    ceo_nm = Column(String(100))
    industry_name = Column(String(200))
    business_item = Column(String(500))
    market_code = Column(String(20))
    corp_cls = Column(String(10))
    is_listed = Column(Boolean, nullable=False, server_default=text("false"))
    is_audited = Column(Boolean, nullable=False, server_default=text("false"))
    service_level = Column(String(20), nullable=False, server_default=text("'UNAVAILABLE'"))
    service_message = Column(String(200))
    est_dt = Column(String(8))
    listing_dt = Column(String(8))
    is_active = Column(Boolean, nullable=False, server_default=text("true"))
    data_source = Column(String(50), nullable=False)
    created_at = Column(DateTime, server_default=text("current_timestamp"))
    updated_at = Column(DateTime, server_default=text("current_timestamp"))