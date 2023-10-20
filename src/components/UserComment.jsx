/* eslint-disable react/prop-types */

import {
  Avatar,
  Button,
  Group,
  Paper,
  Stack,
  Textarea,
  em,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import axios from "axios";
import { useState, useEffect } from "react";

const UserComment = ({ data, setData }) => {
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState("");
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/currentUser");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  console.log(comment);

  console.log(new Date().toISOString());

  const addAcomment = () => {
    if(comment)
   { const time = new Date().toISOString();
    const id = Date.now();
    const sendData = async () => {
      try {
         await axios.post("http://localhost:3000/comments", {
          id,
          content: comment,
          score: 0,
          createdAt: time,
          user,
        });

      } catch (error) {
        console.error(error);
      }
    };
    setData([
      ...data,
      { id, content: comment, score: 0, createdAt: time, user },
    ]);

    
    sendData();
    setComment('')}
    
  };
  
  if (user)
    return !isMobile ? (
      <Paper className="rounded-lg p-5 sm:p-7 relative ">
        <Group align="start">
          <Avatar src={user.image.png}></Avatar>

          <Textarea
            className="flex-1 w-full "
            styles={{
              input: {
                minHeight: 100,
                width: "100%",
                fontSize: em(16),
                fontWeight: "400",
                fontFamily: "inherit",
                padding: "12px 30px",
              },
            }}
            placeholder="Add a comment"
            value={comment}
            onChange={(event) => {
              setComment(event.currentTarget.value);
            }}
          />
          <Button className="bg-primary-moderate-blue hover:opacity-50 duration-200" onClick={addAcomment}>
           Send
          </Button>
        </Group>
      </Paper>
    ) : (
      <Paper className="rounded-lg p-5 sm:p-7 relative  ">
        <Stack align="start" w={"100%"}>
          <Textarea
            className="flex-1 w-full "
            styles={{
              input: {
                minHeight: 100,
                width: "100%",
                fontSize: em(16),
                fontWeight: "400",
                fontFamily: "inherit",
                padding: "12px 30px",
              },
            }}
            placeholder="Add a comment"
            value={comment}
            onChange={(event) => {
              setComment(event.currentTarget.value);
            }}
          />
          <Group justify="space-between" w="100%">
            <Avatar src={user.image.png}></Avatar>
            <Button className="bg-primary-moderate-blue" onClick={addAcomment}>
              Send
            </Button>
          </Group>
        </Stack>
      </Paper>
    );
};

export default UserComment;
