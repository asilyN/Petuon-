import loading from '../assets/Petuon_loading_.gif';

const LogInOut = () => {
    return (
        <div className="loading-overlay">
            <img
            src={loading}
            alt="Loading..."
            className="loading-gif"
            />
        </div>
    )
}

export default LogInOut