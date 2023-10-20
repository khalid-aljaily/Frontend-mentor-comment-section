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

const UserReply = ({ data, setData, c, r, replyMode, setReplyMode }) => {
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

  const addAcomment = () => {
    if(comment)
    {const time = new Date().toISOString();
    const id = Date.now();

    const updateObject = async (objectId, newReply) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/comments/${objectId}`
        );
        const serverReplies = response.data.replies;
        await axios.patch(`http://localhost:3000/comments/${objectId}`, {
          replies: [...serverReplies, newReply],
        });
      } catch (error) {
        console.error(error);
      }
      console.log(objectId);
    };
    setData(
      data.map((comm) => {
        if (comm.id == c.id) {
          comm.replies.push({
            id,
            content: comment,
            createdAt: time,
            user,
            replyingTo: r ? r.user.username : comm.user.username,
            score: 0,
          });
        }
        return comm;
      })
    );
    updateObject(c.id, {
      id,
      content: comment,
      createdAt: time,
      user,
      replyingTo: r ? r.user.username : c.user.username,
      score: 0,
    });

    setReplyMode(!replyMode);

    setComment("");}
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
          <Button className="bg-primary-moderate-blue" onClick={addAcomment}>
            Reply
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
              Reply
            </Button>
          </Group>
        </Stack>
      </Paper>
    );
};

export default UserReply;
