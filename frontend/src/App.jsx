import { useState } from "react";
import "./App.css";
import logoImg from "./assets/ci.png";
import characterImg from "./assets/character.png";

function formatBizrNo(value) {
  if (!value) return "정보없음";
  const v = value.replace(/\D/g, "");
  if (v.length !== 10) return value;
  return `${v.slice(0, 3)}-${v.slice(3, 5)}-${v.slice(5)}`;
}

function formatJurirNo(value) {
  if (!value) return "정보없음";
  const v = value.replace(/\D/g, "");
  if (v.length !== 13) return value;
  return `${v.slice(0, 6)}-${v.slice(6)}`;
}

function formatDate(value) {
  if (!value || value.length !== 8) return "정보없음";
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

const DUMMY_COMPANY = {
  serviceLevel: "FULL",
  serviceMessage: "공시 기반 재무 및 기업정보 제공 대상입니다.",
  companyOverview: {
    corpCode: "00126380",
    corpName: "삼성전자",
    ceoName: "전영현",
    industryName: "전자부품 제조업",
    businessItem: "전자제품 제조 및 판매",
    bizrNo: "124-81-00998",
    jurirNo: "130111-0006246",
    stockCode: "005930",
    marketCode: "KOSPI",
    estDate: "19690113",
    listingDate: "19750611",
  },
};

const DUMMY_FINANCIALS = [
  {
    year: "2022",
    revenue: "302,231,360",
    operatingIncome: "43,376,630",
    netIncome: "55,654,077",
    totalAssets: "448,424,507",
    totalLiabilities: "93,674,903",
    totalEquity: "354,749,604",
  },
  {
    year: "2023",
    revenue: "258,935,494",
    operatingIncome: "6,566,976",
    netIncome: "15,487,100",
    totalAssets: "455,906,980",
    totalLiabilities: "92,228,115",
    totalEquity: "363,678,865",
  },
  {
    year: "2024",
    revenue: "300,870,960",
    operatingIncome: "32,726,760",
    netIncome: "34,451,480",
    totalAssets: "483,003,490",
    totalLiabilities: "108,217,160",
    totalEquity: "374,786,330",
  },
];

const DUMMY_BIZR_NO = "1248100998";
const DUMMY_JURIR_NO = "1301110006246";

function normalizeNumber(value) {
  return (value || "").replace(/\D/g, "");
}

function App() {
  const [searchType, setSearchType] = useState("BIZR_NO");
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [serviceLevel, setServiceLevel] = useState("");
  const [serviceMessage, setServiceMessage] = useState("");
  const [loading, setLoading] = useState(false);

  //const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  const fetchData = async () => {
    setLoading(true);
    setError("");
    setData(null);
    setServiceLevel("");
    setServiceMessage("");

    try {
      const normalized = normalizeNumber(searchValue);

      const isBizrMatch =
        searchType === "BIZR_NO" && normalized === DUMMY_BIZR_NO;

      const isJurirMatch =
        searchType === "JURIR_NO" && normalized === DUMMY_JURIR_NO;

      if (isBizrMatch || isJurirMatch) {
        setServiceLevel(DUMMY_COMPANY.serviceLevel);
        setServiceMessage(DUMMY_COMPANY.serviceMessage);
        setData(DUMMY_COMPANY.companyOverview);
      } else {
        setServiceLevel("UNAVAILABLE");
        setServiceMessage("조회 가능한 기업 정보가 없습니다.");
        setData(null);
      }
    } catch (err) {
      console.error(err);
      setError("조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  /*
  const fetchData = async () => {
    setLoading(true)
    setError("")
    setData(null)
    setServiceLevel("")
    setServiceMessage("")

    try {
      const res = await fetch(
        `${API_BASE_URL}/companies/overview?searchType=${searchType}&searchValue=${searchValue}`
      );

      const json = await res.json()

      if (!res.ok) {
        setError(json.detail || "조회 중 오류가 발생했습니다.")
        setLoading(false)
        return
      }

      setServiceLevel(json.serviceLevel || "")
      setServiceMessage(json.serviceMessage || "")
      setData(json.companyOverview || null)
    } catch (err) {
      console.error(err)
      setError("서버 호출 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }
  */

  return (
    <div className="im-page">
      <header className="im-header">
        <div className="im-header-inner">
          <div className="im-logo-wrap">
            <img src={logoImg} alt="iM뱅크 로고" className="im-logo" />
          </div>

          <div className="im-search-bar">
            <select
              className="im-select"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="BIZR_NO">사업자번호</option>
              <option value="JURIR_NO">법인번호</option>
            </select>

            <input
              className="im-input"
              type="text"
              placeholder={
                searchType === "BIZR_NO"
                  ? "사업자번호를 입력하세요"
                  : "법인번호를 입력하세요"
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            <button className="im-search-btn" onClick={fetchData} disabled={loading}>
              {loading ? "조회중" : "조회"}
            </button>
          </div>
        </div>
      </header>

      <main className="im-main">
        {(serviceMessage || error) && (
          <section
            className={`im-status-banner ${
              error
                ? "status-error"
                : serviceLevel === "FULL"
                ? "status-full"
                : serviceLevel === "BASIC"
                ? "status-basic"
                : serviceLevel === "MINIMAL"
                ? "status-minimal"
                : "status-default"
            }`}
          >
            <div className="im-status-icon">
              {error ? "!" : "✓"}
            </div>
            <div className="im-status-text">
              {error || serviceMessage}
            </div>
          </section>
        )}

        {!serviceMessage && !error && (
          <section className="im-status-banner status-default">
            <div className="im-status-icon">i</div>
            <div className="im-status-text">
              데모 버전입니다. 사업자번호 1248100998 또는 법인번호 1301110006246로 조회할 수 있습니다.
            </div>
          </section>
        )}

        <section className="im-overview-card">
          <div className="im-section-title">업체 개요</div>

          {!data ? (
            <div className="im-overview-content">
              <div className="im-overview-left">
                <div className="im-empty-state">
                  조회 결과가 여기에 표시됩니다.
                </div>
              </div>

              <div className="im-overview-right">
                <div className="im-right-visual">
                  <div className="im-mint-wave im-wave-1" />
                  <div className="im-mint-wave im-wave-2" />
                  <div className="im-mint-wave im-wave-3" />
                  <img
                    src={characterImg}
                    alt="iM 캐릭터"
                    className="im-character"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="im-overview-content">
              <div className="im-overview-left">
                <div className="im-info-table">
                  <div className="im-info-row">
                    <div className="im-info-label">회사명</div>
                    <div className="im-info-value">{data.corpName || "정보없음"}</div>
                  </div>

                  <div className="im-info-row">
                    <div className="im-info-label">대표자명</div>
                    <div className="im-info-value">{data.ceoName || "정보없음"}</div>
                  </div>

                  <div className="im-info-row">
                    <div className="im-info-label">업종명</div>
                    <div className="im-info-value">{data.industryName || "정보없음"}</div>
                  </div>

                  <div className="im-info-row">
                    <div className="im-info-label">주요사업</div>
                    <div className="im-info-value">{data.businessItem || "정보없음"}</div>
                  </div>

                  <div className="im-info-row">
                    <div className="im-info-label">사업자번호</div>
                    <div className="im-info-value">{formatBizrNo(data.bizrNo)}</div>
                  </div>

                  <div className="im-info-row">
                    <div className="im-info-label">법인등록번호</div>
                    <div className="im-info-value">{formatJurirNo(data.jurirNo)}</div>
                  </div>

                  <div className="im-info-row">
                    <div className="im-info-label">주식종목코드</div>
                    <div className="im-info-value im-inline-values">
                      <span>{data.stockCode || "정보없음"}</span>
                      <span className="im-divider" />
                      <span>{data.marketCode || "정보없음"}</span>
                    </div>
                  </div>

                  <div className="im-info-row">
                    <div className="im-info-label">설립일 / 상장일</div>
                    <div className="im-info-value im-inline-values">
                      <span>{formatDate(data.estDate)}</span>
                      <span className="im-divider" />
                      <span>{formatDate(data.listingDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="im-overview-right">
                <div className="im-right-visual">
                  <div className="im-mint-wave im-wave-1" />
                  <div className="im-mint-wave im-wave-2" />
                  <div className="im-mint-wave im-wave-3" />
                  <img
                    src={characterImg}
                    alt="iM 캐릭터"
                    className="im-character"
                  />
                </div>
              </div>
            </div>
          )}
        </section>
        
        {data && serviceLevel === "FULL" && (
          <section className="im-financial-card">
            <div className="im-section-title">핵심요약재무보고서</div>
            <div className="im-financial-subtitle">최근 3개년 기준 (단위: 백만원)</div>

            <div className="im-financial-table-wrap">
              <table className="im-financial-table">
                <thead>
                  <tr>
                    <th>구분</th>
                    {DUMMY_FINANCIALS.map((item) => (
                      <th key={item.year}>{item.year}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>매출액</td>
                    {DUMMY_FINANCIALS.map((item) => (
                      <td key={`revenue-${item.year}`}>{item.revenue}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>영업이익</td>
                    {DUMMY_FINANCIALS.map((item) => (
                      <td key={`op-${item.year}`}>{item.operatingIncome}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>당기순이익</td>
                    {DUMMY_FINANCIALS.map((item) => (
                      <td key={`net-${item.year}`}>{item.netIncome}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>자산총계</td>
                    {DUMMY_FINANCIALS.map((item) => (
                      <td key={`asset-${item.year}`}>{item.totalAssets}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>부채총계</td>
                    {DUMMY_FINANCIALS.map((item) => (
                      <td key={`liab-${item.year}`}>{item.totalLiabilities}</td>
                    ))}
                  </tr>
                  <tr>
                    <td>자본총계</td>
                    {DUMMY_FINANCIALS.map((item) => (
                      <td key={`equity-${item.year}`}>{item.totalEquity}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;