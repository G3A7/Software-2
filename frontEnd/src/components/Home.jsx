import {  useContext, useEffect, useState } from "react";
import { userContext } from "../userContext/UserContext";

function Home() {
  const { token } = useContext(userContext);

  const [text, setText] = useState("");
  const [textToSpeak, setTextToSpeak] = useState("");
  const [listening, setListening] = useState(false);
  // const [listeningL, setListeningL] = useState(false);
  const [selectLang, setSelectLang] = useState("en-US");
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  // recognition.lang = "en-US";
  recognition.continuous = false; // بالكتير جمله

  useEffect(() => {
    recognition.lang = selectLang;
    // console.log(selectLang);
    setText("");
  }, [selectLang]);
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setText(transcript);
  };

  // لما النظام ينتهي من الاستماع هعمل action معين
  recognition.onend = () => {
    setListening(false);
  };

  const startListening = () => {
    setListening(true);
    recognition.start();

    //  recognition.stop();
  };

  return (
    <div>
      <h1 className="title">Hi , {token?.data?.user?.name} 🖐</h1>

      <div className="bodyshow">
        <div className="demo">
          <div>
            <button onClick={startListening} disabled={listening}>
              {listening ? (
                <i className="fa-solid fa-microphone"></i>
              ) : (
                <i className="fa-solid fa-microphone-slash"></i>
              )}
            </button>
            <select
              onChange={(e) => {
                setSelectLang(e.target.value);
              }}
              name=""
              id=""
              value={selectLang}
            >
              <option value="en-US">English</option>
              <option value="ar-EG">Arbic</option>
            </select>
          </div>
          <textarea
            style={{
              direction: selectLang == "ar-EG" ? "rtl" : "ltr",
            }}
            placeholder={`${
              selectLang == "ar-EG"
                ? listening
                  ? "تحليل الكلام"
                  : "النص..."
                : listening
                ? "processing Speah"
                : "text..."
            }`}
            rows={5}
            cols={5}
            type="text"
            value={text}
            readOnly
          />
        </div>
        <div className="demo">
          <div>
            <button
              onClick={() => {
                console.log("Dsd")
                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                utterance.lang = "en-US";


                window.speechSynthesis.cancel(); // لو في صوت شغال
                window.speechSynthesis.speak(utterance);
              }
            }
            >
              <i className="fa-solid fa-volume-high"></i>
            </button>
          </div>
          <textarea
            style={{
              direction: "ltr",
            }}
            placeholder="Write something to speak..."
            rows={5}
            cols={5}
            type="text"
            value={textToSpeak}
            onChange={(e) => setTextToSpeak(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
