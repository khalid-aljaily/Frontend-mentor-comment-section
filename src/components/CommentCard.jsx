/* eslint-disable react/prop-types */

import {
  Paper,
  Text,
  Title,
  Avatar,
  Stack,
  Group,
  Button,
  Flex,
  em,
  Textarea,
  Badge,
  Modal,
} from "@mantine/core";
import { downVote, upVote } from "../utils";
import React ,{ useState } from "react";
import axios from "axios";
import Replies from "./ReplyCard";
import { deleteData } from "../utils";
import { useDisclosure } from "@mantine/hooks";
import UserReply from "./UserReply";
import { getTimeAgo } from "../utils";
import {motion } from 'framer-motion'

export const AnimatedPaper = motion(Paper)


function CommentCard({ c, data, setData }) {
  //c refers to the comment that is going to be rendered
  const [opened, hanlers] = useDisclosure(false);
  const [editMode, setEditMode] = useState(false);
  const [replyMode, setReplyMode] = useState(false);
  const [comment, setComment] = useState(c.content);

  //api call to update the user comment content on the server
  const updateObject = async (objectId) => {
    try {
       await axios.patch(
        `http://localhost:3000/comments/${objectId}`,
        {
          content: comment,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
//a function to  update the user comment
const update = (id) => {
  setData(
    data.map((c) => {
      if (c.id == id) {
        c.content = comment;
        updateObject(id);
      }

      return c;
    })
  );

};

// to delete the user reply
  const deleteReply = (id) => {
    setData(
      data.filter((comment) => {
        return comment.id != id;
      })
    );
    deleteData(id);
  };
//to upvote users comments
  const upVoteFunc = () => {
    setData(
      data.map((comm) => {
        if (comm.id == c.id) {
          comm.score = comm.score + 1;
        }
        return comm;
      })
    );
    upVote(c.id);
  };
//to downvote users comments
  const downVoteFunc = () => {
    setData(
      data.map((comm) => {
        if (comm.id == c.id) {
          comm.score != 0 && comm.score--;
        }
        return comm;
      })
    );
    downVote(c.id);
  };

  return (
    <>
    
      <AnimatedPaper  initial={{opacity:0}} animate={{opacity:1,transition:{duration:.6}}}   key={c.id} className="rounded-lg p-5 sm:p-7 relative">
        <Flex
          wrap="nowrap"
          className="flex-col-reverse items-start md:flex-row md:items-center md:gap-4"
        >
          <Flex
            className={`bg-neutral-light-gray !py-2 p-4 mt-3 md:mt-0 md:!py-4 md:p-4 rounded-xl items-center min-w-[45px] flex-row md:flex-col ${
              editMode && "self-start"
            }`}
          >
            <Button p={0} className="w-4 h-fit" onClick={() => upVoteFunc()}>
              <img src="/src/assets/images/icon-plus.svg" alt="fad" />
            </Button>

            <Text className="text-primary-moderate-blue mx-3 md:mx-0 md:my-3">
              {c.score}
            </Text>
            <Button p={0} className="w-4 h-fit" onClick={() => downVoteFunc()}>
              <img src="/src/assets/images/icon-minus.svg" alt="fad" />
            </Button>
          </Flex>
          <Stack w="100%">
            <Group>
              <Group>
                <Avatar src={c.user.image.png} alt="afa" />
                <Title
                  sx={{ color: "red" }}
                  order={5}
                  className="text-neutral-dark-blue font-[700]"
                >
                  {c.user.username}
                </Title>
                {c.user.username == "juliusomo" && (
                  <Badge
                    size="md"
                    radius="sm"
                    style={{ textTransform: "none" }}
                    className="bg-primary-moderate-blue"
                  >
                    You
                  </Badge>
                )}
                <Text className="text-neutral-grayish-blue">
                  {getTimeAgo(c.createdAt)}{" "}
                </Text>
              </Group>
              <Group className="absolute right-7 bottom-6 md:top-[30px] ml-auto items-start">
                {c.user.username == "juliusomo" && (
                  <Button
                    leftSection={
                      <img
                        src={"/src/assets/images/icon-delete.svg"}
                        alt="afa"
                      />
                    }
                    className=" text-primary-soft-red p-0  hover:opacity-50 duration-300"
                    onClick={() => hanlers.open()}
                  >
                    Delete
                  </Button>
                )}
                {c.user.username != "juliusomo" ? (
                  <Button
                    leftSection={
                      <img
                        src={"/src/assets/images/icon-reply.svg"}
                        alt="afa"
                      />
                    }
                    className=" text-primary-moderate-blue p-0  hover:opacity-50 duration-300"
                    onClick={() => {
                      setReplyMode(!replyMode);
                    }}
                  >
                    Reply
                  </Button>
                ) : (
                  <Button
                    leftSection={
                      <img src={"/src/assets/icon-edit.svg"} alt="afa" />
                    }
                    className={`text-primary-moderate-blue p-0  hover:opacity-50 duration-300
                    }`}
                    onClick={() => {
                      setEditMode(!editMode);
                    }}
                  >
                    Edit
                  </Button>
                )}
                <Modal
                  radius={10}
                  opened={opened}
                  onClose={() => hanlers.close()}
                  title="Delete comment"
                  styles={{
                    title: {
                      fontWeight: 700,
                      fontFamily: "Rubik",
                      padding: "20px 0 0 ",
                      fontSize: 22,
                    },
                    content: { padding: 10 },
                  }}
                  className="text-neutral-dark-blue"
                  withCloseButton={false}
                  centered
                >
                  <Stack>
                    <Text className="text-neutral-grayish-blue">
                      Are you sure you want to delete this comment? This will
                      remove the comment and can't be undone.
                    </Text>
                    <Group>
                      <Button
                        className="bg-neutral-grayish-blue flex-1 h-10"
                        onClick={() => hanlers.close()}
                      >
                        No, Cancel
                      </Button>
                      <Button
                        className="bg-primary-soft-red flex-1 h-10"
                        onClick={() => deleteReply(c.id)}
                      >
                        Yes, Delete
                      </Button>
                    </Group>
                  </Stack>
                </Modal>
              </Group>
            </Group>
            {editMode ? (
              <>
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
                <Button
                  className="self-end bg-primary-moderate-blue hover:opacity-50 duration-300"
                  onClick={() => {
                    update(c.id);
                    setEditMode(!editMode);
                  }}
                >
                  UPDATE
                </Button>
              </>
            ) : (
              <Text className="text-neutral-grayish-blue">{c.content}</Text>
            )}
          </Stack>
        </Flex>
      </AnimatedPaper>
     
      {replyMode && (
        <UserReply
          c={c}
          data={data}
          setData={setData}
          replyMode={replyMode}
          setReplyMode={setReplyMode}
        />
      )}
      <div className="space-y-5 border-l-2 border-gray-300 w-[95%] ml-auto">
        {c.replies &&
          c.replies.map((r) => (
            <Replies
              c={c}
              r={r}
              key={r.id}
              update={update}
              data={data}
              setData={setData}
            />
          ))}
      </div>
    </>
  );
}

export default CommentCard;
