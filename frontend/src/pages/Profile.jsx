import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  User,
  Calendar,
  Ruler,
  Weight,
  Target,
  Pencil,
} from "lucide-react";

function Profile() {
  const [user, setUser] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({});

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://127.0.0.1:8000/profile/${userId}`)
      .then((res) => {
        if (!res.data.message) {
          setUser(res.data);
        }
      })
      .catch((err) => console.log(err));
  }, [userId]);

  const openEdit = () => {
    setEditData(user);
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/profile/${userId}`,
        editData
      );

      setUser(editData);
      setIsEditOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-green-950 p-6">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-slate-900/70 border-slate-800 backdrop-blur-xl rounded-3xl">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-emerald-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">
                  {user.name}
                </h1>

                <p className="text-slate-400 mt-1">
                  {user.email}
                </p>
              </div>

              <Button
                onClick={openEdit}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-5 mt-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-emerald-400" />
                    <div>
                      <p className="text-slate-400 text-sm">
                        Age
                      </p>
                      <h3 className="text-xl font-bold text-white">
                        {user.age}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <Ruler className="text-emerald-400" />
                    <div>
                      <p className="text-slate-400 text-sm">
                        Height
                      </p>
                      <h3 className="text-xl font-bold text-white">
                        {user.height} cm
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <Weight className="text-emerald-400" />
                    <div>
                      <p className="text-slate-400 text-sm">
                        Weight
                      </p>
                      <h3 className="text-xl font-bold text-white">
                        {user.weight} kg
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Goal */}
            <Card className="mt-6 bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Target className="text-emerald-400" />
                  <div>
                    <p className="text-slate-400 text-sm">
                      Fitness Goal
                    </p>
                    <h3 className="text-xl font-bold text-white">
                      {user.goal}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Modal */}
        {isEditOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-5">
                Edit Profile
              </h2>

              <div className="space-y-4">
                <input
                  disabled
                  value={editData.name || ""}
                  className="w-full rounded-lg bg-slate-800 p-3 text-white"
                />

                <input
                  disabled
                  value={editData.email || ""}
                  className="w-full rounded-lg bg-slate-800 p-3 text-white"
                />

                <input
                  type="number"
                  placeholder="Age"
                  value={editData.age || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      age: e.target.value,
                    })
                  }
                  className="w-full rounded-lg bg-slate-800 p-3 text-white"
                />

                <input
                  type="number"
                  placeholder="Height"
                  value={editData.height || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      height: e.target.value,
                    })
                  }
                  className="w-full rounded-lg bg-slate-800 p-3 text-white"
                />

                <input
                  type="number"
                  placeholder="Weight"
                  value={editData.weight || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      weight: e.target.value,
                    })
                  }
                  className="w-full rounded-lg bg-slate-800 p-3 text-white"
                />

                <select
                  value={editData.goal || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      goal: e.target.value,
                    })
                  }
                  className="w-full rounded-lg bg-slate-800 p-3 text-white"
                >
                  <option>Weight Loss</option>
                  <option>Weight Gain</option>
                  <option>Muscle Gain</option>
                  <option>Fitness</option>
                </select>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleUpdate}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  >
                    Save
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setIsEditOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;