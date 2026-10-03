import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

function App() {
  const [text, setText] = useState("");
  const [type, setType] = useState("URL");
  const [wifiSecurity, setWifiSecurity] = useState("WPA");
  const [wifiName, setWifiName] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [qrSize, setQrSize] = useState(200);
  const [foreground, setForeground] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [qrMargin, setQrMargin] = useState(0);
  const [errorLevel, setErrorLevel] = useState("M");
  const [recentQRs, setRecentQRs] = useState([]);

  const wifiText = `WIFI:T:${wifiSecurity};S:${wifiName};P:${wifiPassword};;`;

  useEffect(() => {
    try {
      const savedQRs =
        JSON.parse(localStorage.getItem("recentQRs")) || [];
      setRecentQRs(savedQRs);
    } catch {
      setRecentQRs([]);
    }
  }, []);

  const isValidURL = (value) => {
    return (
      value.startsWith("http://") ||
      value.startsWith("https://")
    );
  };

  const saveRecentQR = () => {
    if (!text && !(type === "Wi-Fi" && wifiName)) return;

    const newQR = {
      type: type,
      value: type === "Wi-Fi" ? wifiText : text,
      date: new Date().toLocaleString(),
    };

    const existingQRs =
      JSON.parse(localStorage.getItem("recentQRs")) || [];

    const updatedQRs = [newQR, ...existingQRs].slice(0, 5);

    localStorage.setItem(
      "recentQRs",
      JSON.stringify(updatedQRs)
    );

    setRecentQRs(updatedQRs);
  };

  const downloadQR = () => {
    const canvas = document.getElementById("qr-code");

    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div>
      <h1>QR Studio</h1>

      <p>Selected type: {type}</p>
      <p>Create beautiful QR codes easily.</p>

      <div>
        {["URL", "Text", "Email", "Phone", "Wi-Fi"].map(
          (item) => (
            <button
              key={item}
              onClick={() => setType(item)}
            >
              {item}
            </button>
          )
        )}
      </div>

      <input
        type="text"
        placeholder={`Enter ${type}`}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      {type === "URL" && text && !isValidURL(text) && (
        <p style={{ color: "red" }}>
          Please enter a valid URL starting with http:// or
          https://
        </p>
      )}

      {type === "Wi-Fi" && (
        <>
          <input
            type="text"
            placeholder="Wi-Fi network name (SSID)"
            value={wifiName}
            onChange={(event) =>
              setWifiName(event.target.value)
            }
          />

          <input
            type="password"
            placeholder="Wi-Fi password"
            value={wifiPassword}
            onChange={(event) =>
              setWifiPassword(event.target.value)
            }
          />

          <select
            value={wifiSecurity}
            onChange={(event) =>
              setWifiSecurity(event.target.value)
            }
          >
            <option value="WPA">WPA/WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">No password</option>
          </select>
        </>
      )}

      <div>
        <label>QR Color: </label>
        <input
          type="color"
          value={foreground}
          onChange={(event) =>
            setForeground(event.target.value)
          }
        />
      </div>

      <div>
        <label>Background: </label>
        <input
          type="color"
          value={background}
          onChange={(event) =>
            setBackground(event.target.value)
          }
        />
      </div>

      {type !== "Wi-Fi" && (
        <div>
          <label>QR Size: {qrSize}px</label>
          <input
            type="range"
            min="100"
            max="400"
            value={qrSize}
            onChange={(event) =>
              setQrSize(Number(event.target.value))
            }
          />
        </div>
      )}

      <div>
        <label>Margin: {qrMargin}</label>
        <input
          type="range"
          min="0"
          max="10"
          value={qrMargin}
          onChange={(event) =>
            setQrMargin(Number(event.target.value))
          }
        />
      </div>

      <div>
        <label>Error Correction: </label>
        <select
          value={errorLevel}
          onChange={(event) =>
            setErrorLevel(event.target.value)
          }
        >
          <option value="L">Low</option>
          <option value="M">Medium</option>
          <option value="Q">Quartile</option>
          <option value="H">High</option>
        </select>
      </div>

      <h2>QR Preview</h2>

      <button
        onClick={() => {
          downloadQR();
          saveRecentQR();
        }}
      >
        Download PNG
      </button>

      {text || (type === "Wi-Fi" && wifiName) ? (
        <QRCodeCanvas
          id="qr-code"
          value={
            type === "Phone"
              ? `tel:${text}`
              : type === "Email"
              ? `mailto:${text}`
              : type === "Wi-Fi"
              ? wifiText
              : text
          }
          size={qrSize}
          fgColor={foreground}
          bgColor={background}
          marginSize={qrMargin}
          level={errorLevel}
        />
      ) : (
        <p>Enter something above to generate your QR code.</p>
      )}

      <h2>Recent QR Codes</h2>

      {recentQRs.length === 0 ? (
        <p>No recent QR codes yet.</p>
      ) : (
        recentQRs.map((qr, index) => (
          <div key={index}>
            <p>{qr.type}</p>
            <p>{qr.value}</p>
            <p>{qr.date}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;