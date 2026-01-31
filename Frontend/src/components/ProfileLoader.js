import "./ProfileLoader.css";

function ProfileLoader() {
  return (
    <div className="profile-loader">
      <div className="loader-card">
        <div className="avatar-skeleton" />
        <div className="line short" />
        <div className="line" />
        <div className="line" />
      </div>
    </div>
  );
}

export default ProfileLoader;
