import { useEffect, useState } from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import CommentCard from "./components/CommentCard";
import UserComment from "./components/UserComment";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/comments");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <MantineProvider>
      <div className="w-screen h-screen bg-neutral-light-gray md:px-16 py-16 overflow-auto">
        <div className="max-w-[95%] lg:max-w-[70%] mx-auto space-y-5 mb-5">
          {data &&
            data.map((c) => (
              <CommentCard key={c.id} c={c} data={data} setData={setData} />
            ))}
          <UserComment data={data} setData={setData} />
        </div>
      </div>
    </MantineProvider>
  );
}

export default App;
