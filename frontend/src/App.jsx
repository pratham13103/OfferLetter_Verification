import GenerateOfferLetter from "./GenerateOfferLetter";
import "./index.css";
import ErrorBoundary from "./ErrorBoundary";

function App() {
    return (
        <div className="app">
            <ErrorBoundary>
                <GenerateOfferLetter />
            </ErrorBoundary>
        </div>
    );
}

export default App;
