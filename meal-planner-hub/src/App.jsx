import axios from"axios";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("planner");
  const [item, setItem] = useState("");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const emptyMeals = {
    Monday: { breakfast: "", lunch: "", dinner: "" },
    Tuesday: { breakfast: "", lunch: "", dinner: "" },
    Wednesday: { breakfast: "", lunch: "", dinner: "" },
    Thursday: { breakfast: "", lunch: "", dinner: "" },
    Friday: { breakfast: "", lunch: "", dinner: "" },
    Saturday: { breakfast: "", lunch: "", dinner: "" },
    Sunday: { breakfast: "", lunch: "", dinner: "" },
  };

  const [meals, setMeals] = useState(emptyMeals);

  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem("groceryItems")) || []
  );

  const [water, setWater] = useState(
    JSON.parse(localStorage.getItem("waterCount")) || 0
  );
const [time, setTime] = useState(new Date());
const [weight, setWeight] = useState("");
const [height, setHeight] = useState("");
  const [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem("profile")) || {
      name: "",
      age: "",
      weight: "",
      height: "",
      goal: "",
      calories: "",
    }
  );

  useEffect(() => {
    localStorage.setItem("meals", JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem("groceryItems", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("waterCount", JSON.stringify(water));
  }, [water]);

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
  axios
    .get("http://localhost:5000/getMeals")
    .then((response) => {
      if (Object.keys(response.data).length > 0) {
        setMeals(response.data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}, []);
useEffect(() => {
  const interval = setInterval(() => {
    setTime(new Date());
  }, 1000);

  return () => clearInterval(interval);
}, []);
  const handleMealChange = (day, type, value) => {
    setMeals({
      ...meals,
      [day]: {
        ...meals[day],
        [type]: value,
      },
    });
  };const saveMeals = async () => {
  try {
    await axios.post("http://localhost:5000/saveMeals", meals);
    alert("Meals saved to backend!");
  } catch (error) {
    console.log(error);
  }
};

  const handleProfileChange = (field, value) => {
    setProfile({
      ...profile,
      [field]: value,
    });
  };
  
const mealsPlanned = Object.values(meals).reduce(
  (count, day) =>
    count +
    (day.breakfast ? 1 : 0) +
    (day.lunch ? 1 : 0) +
    (day.dinner ? 1 : 0),
  0
);
  return (
    <div className="container">
      <div className="date-card">
  📅 {new Date().toLocaleDateString()}
</div>
<div className="clock-card">
  🕒 {time.toLocaleTimeString()}
</div>

      <nav className="navbar">
        <h1>🍽 Meal Planner Hub</h1>

        <div className="menu">
          <button onClick={() => setActiveTab("planner")}>
            Weekly Planner
          </button>

          <button onClick={() => setActiveTab("grocery")}>
            Grocery List
          </button>

          <button onClick={() => setActiveTab("analytics")}>
            Analytics
          </button>

          <button onClick={() => setActiveTab("profile")}>
            Profile
          </button>

          <button onClick={() => setActiveTab("water")}>
            Water Tracker
          </button>
          <button onClick={() => setActiveTab("bmi")}>
  BMI Calculator
</button>
        </div>
      </nav>
      {activeTab === "planner" && (
        <>
          <h2 className="heading">Weekly Meal Planner</h2>

          <div className="grid">
            {days.map((day) => (
              <div className="card" key={day}>
                <h2>{day}</h2>

                <input
                  placeholder="Breakfast"
                  value={meals[day].breakfast}
                  onChange={(e) =>
                    handleMealChange(day, "breakfast", e.target.value)
                  }
                />

                <input
                  placeholder="Lunch"
                  value={meals[day].lunch}
                  onChange={(e) =>
                    handleMealChange(day, "lunch", e.target.value)
                  }
                />

                <input
                  placeholder="Dinner"
                  value={meals[day].dinner}
                  onChange={(e) =>
                    handleMealChange(day, "dinner", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
         <button
  className="save-btn"
  onClick={saveMeals}
>
  Save Meals
</button>
        </>
      )}
      {activeTab === "grocery" && (
        <div className="box">
          <h2>🛒 Grocery List</h2>

          <input
            type="text"
            placeholder="Add grocery item"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />

          <button
            className="add-btn"
            onClick={() => {
              if (item.trim() !== "") {
                setItems([...items, item]);
                setItem("");
              }
            }}
          >
            Add Item
          </button>

          <ul>
            {items.map((food, index) => (
              <li key={index}>
                {food}

                <button
                  className="delete-btn"
                  onClick={() =>
                    setItems(items.filter((_, i) => i !== index))
                  }
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="box">
          <h2>📊 Analytics Dashboard</h2>

          <div className="stats">
            <div className="stat-card">
              <h3>🛒 Grocery Items</h3>
              <h1>{items.length}</h1>
            </div>

            <div className="stat-card">
              <h3>💧 Water Intake</h3>
              <h1>{water}</h1>
            </div>

            <div className="stat-card">
              <h3>🍽 Meals Planned</h3>
              <h1>{mealsPlanned}</h1>
            </div>

            <div className="stat-card">
              <h3>📅 Healthy Days</h3>
              <h1>7</h1>
            </div>
          </div>
        </div>
      )}
      {activeTab === "profile" && (
        <div className="box">
          <h2>👤 Profile</h2>

          <input
            placeholder="Your Name"
            value={profile.name}
            onChange={(e) => handleProfileChange("name", e.target.value)}
          />

          <input
            placeholder="Age"
            value={profile.age}
            onChange={(e) => handleProfileChange("age", e.target.value)}
          />

          <input
            placeholder="Weight (kg)"
            value={profile.weight}
            onChange={(e) => handleProfileChange("weight", e.target.value)}
          />

          <input
            placeholder="Height (cm)"
            value={profile.height}
            onChange={(e) => handleProfileChange("height", e.target.value)}
          />

          <input
            placeholder="Fitness Goal"
            value={profile.goal}
            onChange={(e) => handleProfileChange("goal", e.target.value)}
          />

          <input
            placeholder="Daily Calories Target"
            value={profile.calories}
            onChange={(e) => handleProfileChange("calories", e.target.value)}
          />

          <button className="save-btn">
            Save Profile
          </button>
        </div>
      )}

      {activeTab === "water" && (
        <div className="box">
          <h2>💧 Water Intake Tracker</h2>

          <div className="water-display">
            <h1>{water} Glasses</h1>
          </div>
<div className="progress-bar">
  <div
    className="progress"
    style={{ width: `${(water / 8) * 100}%` }}
  ></div>
</div>

<p>{water}/8 Daily Goal</p>
          <button
            className="water-btn"
            onClick={() => setWater(water + 1)}
          >
            + Add Glass
          </button>

          <button
            className="reset-btn"
            onClick={() => setWater(0)}
          >
            Reset
          </button>
        </div>
      )}
      {activeTab === "bmi" && (
  <div className="box">
    <h2>⚖️ BMI Calculator</h2>

    <input
      placeholder="Weight (kg)"
      value={weight}
      onChange={(e) => setWeight(e.target.value)}
    />

    <input
      placeholder="Height (m)"
      value={height}
      onChange={(e) => setHeight(e.target.value)}
    />

    <h2>
      BMI : {height && weight
        ? (weight / (height * height)).toFixed(1)
        : 0}
    </h2>
  </div>
)}
      
    </div>
  );
}

export default App;