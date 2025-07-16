import './Welcome.css'; 
import HeaderStart from "../../components/Header/HeaderStart";
import { useNavigate } from 'react-router-dom'; 

function Welcome () {
    const navigate = useNavigate(); 

    const handleGetStarted = () => {
        navigate('/register'); 
    };

    return (
        <>
            <HeaderStart />
            
            <div className="welcome-background">
                <div className="welcome-overlay-text">
                    <h1>Welcome to Papaia</h1>
                    <p>“Empowering Farmers Through AI Plant Care.”</p>
                    <h4>
                        Papaia App is a mobile and web-based agricultural tool designed to help 
                        papaya farmers detect diseases in papaya leaves and fruits using artificial 
                        intelligence (AI). By scanning affected plant parts through a smartphone 
                        camera, the app identifies specific diseases and provides suggested 
                        treatments, enabling early intervention and improved crop health.
                    </h4>
                    <button className="get-started-button" onClick={handleGetStarted}>
                        Get Started
                    </button>
                </div>
            </div>
        </>
    );
}

export default Welcome;
