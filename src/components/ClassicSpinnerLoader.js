import { ClassicSpinner } from "react-spinners-kit";

const ClassicSpinnerLoader = () => {
    return (
        // loader를 화면 가운데 정렬하기 위해 position, flex를 이용한다.
        <div>
            <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", zIndex: "1000", background: "#fafafa", opacity: "0.5" }}>
            </div>
            <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", zIndex: "1001" }}>
                <ClassicSpinner size={80} color={"#000000"} />
            </div>
        </div>
    )
}

export default ClassicSpinnerLoader;