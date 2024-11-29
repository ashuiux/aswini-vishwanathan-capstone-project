    import React, { useEffect, useState } from "react";
    import { getMethods, addMethod } from "../../api/method";
    import MethodCard from "../../components/MethodCard/MethodCard";
    import AddMethodForm from "../../components/AddMethod/AddMethod";
    import "./ResearchMethodsPage.scss";

    function ResearchMethodsPage() {
    const [methods, setMethods] = useState([]);
    const [error, setError] = useState("");
    const [filteredMethods, setFilteredMethods] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        const fetchMethods = async () => {
        try {
            const methodsData = await getMethods();
            setMethods(methodsData);
            setFilteredMethods(methodsData);
        } catch (err) {
            console.error("Error fetching methods:", err.message);
            setError("Failed to fetch research methods.");
        }
        };

        fetchMethods();
    }, []);

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        if (filter === "design") {
        setFilteredMethods(
            methods.filter(
            (method) =>
                method.design_type === "New Design" || method.design_type === "Both"
            )
        );
        } else if (filter === "redesign") {
        setFilteredMethods(
            methods.filter(
            (method) =>
                method.design_type === "Redesign" || method.design_type === "Both"
            )
        );
        } else {
        setFilteredMethods(methods);
        }
    };

    const handleAddMethod = async (newMethod) => {
        try {
        console.log("Adding new method:", newMethod);
        const addedMethod = await addMethod(newMethod);
        console.log("Method added to server:", addedMethod);
    
        setMethods((prev) => [...prev, addedMethod]);
        setFilteredMethods((prev) => [...prev, addedMethod]);
        } catch (err) {
        console.error("Error adding method:", err.message);
        }
    };
    

    return (
        <div className="research-methods">
        <h1>Research Methods</h1>
        {error && <p className="error">{error}</p>}

        <div className="toggle-bar">
  <label className="switch">
    <input
      type="checkbox"
      checked={activeFilter === "new-design"}
      onChange={() =>
        handleFilterChange(activeFilter === "new-design" ? "redesign" : "new-design")
      } />
    <span className="slider">
      <span className="toggle-label left">New Design</span>
      <span className="toggle-label right">Redesign</span>
    </span>
  </label>
</div>

    


        <div className="methods-container">
            {filteredMethods.length > 0 ? (
            filteredMethods.map((method) => (
                <MethodCard key={method.id} method={method} />
            ))
            ) : (
            !error && <p>No research methods found for the selected category.</p>
            )}
        </div>

        <AddMethodForm onSubmit={handleAddMethod} />
        </div>
    );
    }

    export default ResearchMethodsPage;