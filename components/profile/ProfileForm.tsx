"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ProfileFormProps {
  userId: string;
}

export default function ProfileForm({ userId }: ProfileFormProps) {
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    created_at?: string;
  } | null>(null);
  // const [profile, setProfile] = useState<{
  //   full_name?: string;
  //   avatar_url?: string;
  // } | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/sign-in");
          return;
        }

        if (userId !== session.user.id) {
          router.push(`/profile/${session.user.id}`);
          return;
        }

        setUser(session.user);
        fetchProfile(session.user.id);
      } catch (error) {
        console.error("Auth session error:", error);
        setLoading(false);
      }
    }

    getUser();
  }, [userId, router]);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      if (data) {
        // setProfile(data);
        setFullName(data.full_name || "");
        setAvatarUrl(data.avatar_url);

        if (data.avatar_url) {
          const img = new window.Image();
          img.onerror = () => console.error("Image URL failed to load");
          img.src = data.avatar_url;
        }
      } else {
        await createProfile(userId);
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createProfile(userId: string) {
    try {
      const { error } = await supabase.from("profiles").insert([
        {
          id: userId,
          full_name: "",
          avatar_url: null,
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error creating profile:", error);
        throw error;
      }

      await fetchProfile(userId);
    } catch (error) {
      console.error("Error in createProfile:", error);
    }
  }
  function isValidImageFile(file: File) {
    // List of allowed MIME types for images
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
    ];

    // Check file type
    if (!validImageTypes.includes(file.type)) {
      return {
        valid: false,
        error: "File must be a valid image (JPEG, PNG, GIF, etc.)",
      };
    }

    // Check file size (limit to 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      return {
        valid: false,
        error: "Image size must be less than 5MB",
      };
    }

    return { valid: true, error: null };
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }

    const file = e.target.files[0];

    const validation = isValidImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      e.target.value = "";
      return;
    }

    setError(null);
    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function uploadAvatar(userId: string, file: File) {
    try {
      const validation = isValidImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error || "Invalid file");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now().toString()}.${fileExt}`;
      const filePath = `avatars/${userId}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("profile-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error in uploadAvatar:", error);
      throw error;
    }
  }

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      setError("User session not found. Please sign in again.");
      return;
    }
    setUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let newAvatarUrl = avatarUrl;

      if (avatarFile) {
        newAvatarUrl = await uploadAvatar(user.id, avatarFile);
      }

      const updateData = {
        full_name: fullName,
        avatar_url: newAvatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (checkError) {
        if (checkError.code === "PGRST116") {
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              full_name: fullName,
              avatar_url: newAvatarUrl,
              updated_at: new Date().toISOString(),
            });

          if (insertError) {
            throw insertError;
          }
        } else {
          throw checkError;
        }
      } else {
        const { error } = await supabase
          .from("profiles")
          .update(updateData)
          .eq("id", user.id)
          .select();

        if (error) {
          throw error;
        }
      }

      setSuccessMessage("Profile updated successfully!");
      setAvatarUrl(newAvatarUrl);
      setAvatarFile(null);
      setAvatarPreview(null);

      fetchProfile(user.id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        setError((error as { message: string }).message);
      } else {
        setError("Error updating profile");
      }
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-8 rounded-xl bg-transparent flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4 justify-center">
            <div className="relative w-14 h-14">
              <motion.div
                className="absolute inset-0 border-4 border-purple-600 border-opacity-30 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="absolute inset-0 border-4 border-t-purple-600 rounded-full"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        {/* Profile Header */}
        <div className="bg-white rounded-t-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile Avatar */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-32 w-32 rounded-full border-4 border-gray-50 shadow-lg overflow-hidden">
                {avatarPreview || avatarUrl ? (
                  <Image
                    src={avatarPreview || avatarUrl || ""}
                    alt={fullName || "Profile"}
                    width={300}
                    height={400}
                    className="object-cover"
                    unoptimized={!!avatarPreview}
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-4xl font-bold text-white">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </motion.div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <motion.h1
                className="text-3xl font-bold text-gray-800"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {fullName || "Welcome"}
              </motion.h1>
              <motion.p
                className="text-gray-500 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {user?.email}
              </motion.p>
              <motion.p
                className="text-sm text-gray-400 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Member since{" "}
                {new Date(user?.created_at || Date.now()).toLocaleDateString()}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-4 px-1 text-center text-sm font-medium ${
              activeTab === "profile"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            } transition-colors duration-200`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-4 px-1 text-center text-sm font-medium ${
              activeTab === "settings"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            } transition-colors duration-200`}
          >
            Account Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 bg-white rounded-b-xl shadow-lg">
          <AnimatePresence mode="wait">
            {activeTab === "profile" ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                    Your Profile
                  </h2>
                  <p className="text-sm text-gray-500">
                    Update your personal information
                  </p>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 border-l-4 border-red-500 p-4 rounded"
                      >
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-red-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {successMessage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-green-50 border-l-4 border-green-500 p-4 rounded"
                      >
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-green-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-green-700">
                              {successMessage}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="shadow-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border border-gray-300 rounded-lg p-3 transition duration-150"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="text"
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-gray-50 block w-full sm:text-sm border border-gray-300 rounded-lg p-3 text-gray-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email address cannot be changed
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="avatar"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Profile Picture
                    </label>
                    <div className="mt-1 flex items-center">
                      <div className="flex items-center">
                        <input
                          type="file"
                          id="avatar"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor="avatar"
                          className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                          Choose Image
                        </label>
                        {avatarFile && (
                          <p className="text-sm text-gray-500">
                            {avatarFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <motion.button
                        type="submit"
                        disabled={updating}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                          updating
                            ? "bg-purple-400"
                            : "bg-purple-600 hover:bg-purple-700"
                        }`}
                      >
                        {updating ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </div>
                        ) : (
                          "Save Changes"
                        )}
                      </motion.button>
                    </div>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                    Account Settings
                  </h2>
                  <p className="text-sm text-gray-500">
                    Manage your account preferences
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-center text-gray-500">
                    Account settings will be available soon
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
