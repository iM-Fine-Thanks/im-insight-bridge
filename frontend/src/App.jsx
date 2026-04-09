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

function App() {
  const [searchType, setSearchType] = useState("BIZR_NO");
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [serviceLevel, setServiceLevel] = useState("");
  const [serviceMessage, setServiceMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true)
    setError("")
    setData(null)
    setServiceLevel("")
    setServiceMessage("")

    try {
      const res = await fetch(
        `http://localhost:8000/companies/overview?searchType=${searchType}&searchValue=${searchValue}`
      )

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
              사업자번호 또는 법인번호를 입력하면 기업 정보를 조회할 수 있습니다.
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
      </main>
    </div>
  );
}

export default App;