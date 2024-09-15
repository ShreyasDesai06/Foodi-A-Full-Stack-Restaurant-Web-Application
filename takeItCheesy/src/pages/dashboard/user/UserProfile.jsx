import React, { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthProvider';
import { useForm } from 'react-hook-form';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from '../../../firebase/firebase.config';

const UserProfile = () => {
    const { updateUserProfile } = useContext(AuthContext);
    const storage = getStorage(app);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const name = data.name;
        const file = data.photoURL[0]; // Access the uploaded file

        if (file) {
            // Upload file to Firebase Storage
            const storageRef = ref(storage, `user_photos/${file.name}`);
            await uploadBytes(storageRef, file);
            const photoURL = await getDownloadURL(storageRef);

            updateUserProfile(name, photoURL)
                .then(() => {
                    alert("Profile updated successfully");
                })
                .catch((error) => {
                    console.error("Error updating profile:", error);
                });
        } else {
            // If no photo is uploaded, just update the name
            updateUserProfile(name, null)
                .then(() => {
                    alert("Profile updated successfully");
                })
                .catch((error) => {
                    console.error("Error updating profile:", error);
                });
        }
    };

    return (
        <div className='h-screen max-w-md mx-auto flex items-center justify-center'>
            <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input
                            type="text"
                            {...register("name")}
                            placeholder="Your name"
                            className="input input-bordered"
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Upload Photo</span>
                        </label>
                        <input
                            type="file"
                            {...register("photoURL")}
                            className="file-input w-full mt-1"
                        />
                    </div>
                    <div className="form-control mt-6">
                        <input
                            type='submit'
                            value={"Update"}
                            className="btn bg-green text-white"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
