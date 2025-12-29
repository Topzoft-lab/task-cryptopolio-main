import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API } from "../../config/api";

export default function UpdateInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const userid = location.state?.id;

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [userdata, setuserdata] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(API.userDetails, {
          method: "POST",
          body: JSON.stringify({ UserId: userid }),
          headers: { "Content-type": "application/json" },
        });
        const json = await response.json();
        setuserdata(json);
        if (json.userProfile?.[0]?.url) {
          setPreview(json.userProfile[0].url);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (userid) fetchUserData();
  }, [userid]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!image) return;
    
    setLoading(true);
    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "crypto_profile");
      data.append("cloud_name", "dcth4owgy");

      const cloudResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dcth4owgy/image/upload",
        { method: "post", body: data }
      );
      const cloudData = await cloudResponse.json();

      await fetch(API.profileUpdate, {
        method: "POST",
        body: JSON.stringify({ UserId: userid, ProfileUrl: cloudData.url }),
        headers: { "Content-type": "application/json" },
      });

      navigate("/dashboard", { state: { id: userid } });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-12">
      <div className="max-w-lg mx-auto px-4">
        {/* Back button */}
        <button 
          onClick={() => navigate("/dashboard", { state: { id: userid } })}
          className="flex items-center gap-2 text-dark-400 hover:text-white mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-white mb-2">
              Update Profile Picture
            </h1>
            <p className="text-dark-400">
              Choose a new profile photo
            </p>
          </div>

          {/* Preview */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div
                className="w-32 h-32 rounded-full bg-cover bg-center border-4 border-dark-700"
                style={{ 
                  backgroundImage: preview ? `url(${preview})` : 'none',
                  backgroundColor: '#334155'
                }}
              />
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* User Info */}
          {userdata.Data && (
            <div className="bg-dark-900/50 rounded-xl p-4 mb-6">
              <div className="text-center">
                <p className="text-white font-semibold">
                  {userdata.Data.first_name} {userdata.Data.last_name}
                </p>
                <p className="text-dark-400 text-sm">{userdata.Data.email}</p>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {image && (
            <button
              onClick={uploadImage}
              disabled={loading}
              className="btn-primary w-full py-4"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Save Profile Picture"
              )}
            </button>
          )}

          {!image && (
            <p className="text-center text-dark-500 text-sm">
              Click the camera icon to select a new photo
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
