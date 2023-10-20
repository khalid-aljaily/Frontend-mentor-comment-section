/* eslint-disable react/prop-types */

import {
  Text,
  Avatar,
  Stack,
  Group,
  Button,
  Flex,
  em,
  Textarea,
  Badge,
  Title,
  Modal,
} from "@mantine/core";
import { useState } from "react";
import axios from "axios";
import { useDisclosure } from "@mantine/hooks";
import UserReply from "./UserReply";
import { downVote, upVote } from "../utils";
import { getTimeAgo } from "../utils";
import { AnimatedPaper } from "./CommentCard";



const Replies = ({ r, c, data, setData }) => {
  const [editMode, setEditMode] = useState(false);
  const [comment, setComment] = useState(r.content);
  const [opened, handlers] = useDisclosure(false);
  const [replyMode, setReplyMode] = useState(false);
  const updateObject = async (objectId, replies) => {
    try {
      await axios.patch(`http://localhost:3000/comments/${objectId}`, {
        replies,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const update = (id) => {
    let reps = [];

    setData(
      data.map((c) => {
        c.replies &&
          c.replies.map((rp) => {
            if (rp.id == id) {
              rp.content = comment;
            }
            reps.push(rp);
            updateObject(c.id, reps);
          });

        return c;
      })
    );
  };
  const deleteReply = (c, id) => {
    setData(
      data.map((comment) => {
        if (comment.id == c.id) {
          comment.replies = comment.replies.filter((reply) => reply.id != id);
          updateObject(c.id, comment.replies);
        }
        return comment;
      })
    );
  };
  const upVoteFunc = () => {
    setData(
      data.map((comm) => {
        if (comm.id == c.id) {
          comm.replies.map((rep) => {
            if (rep.id == r.id) {
              rep.score++;
            }
            return rep;
          });
        }
        return comm;
      })
    );
    upVote(c.id, r);
  };
  const downVoteFunc = () => {
    setData(
      data.map((comm) => {
        if (comm.id == c.id) {
          comm.replies.map((rep) => {
            if (rep.id == r.id) {
              rep.score > 0 && rep.score--;
            }
            return rep;
          });
        }
        return comm;
      })
    );
    downVote(c.id, r);
  };
  return (
    <> 
      <AnimatedPaper initial={{opacity:0}} animate={{opacity:1,transition:{duration:.5}}}  
        key={r.id}
        className="rounded-lg ml-auto   p-5 sm:p-7 max-w-[95%] relative"
      >
        <Flex
          wrap="nowrap"
          className="flex-col-reverse items-start md:flex-row md:items-center md:gap-4 "
        >
          <Flex
            className={`bg-neutral-light-gray !py-2 p-4 mt-3 md:mt-0 md:!py-4 md:p-4 rounded-xl items-center min-w-[45px] flex-row md:flex-col ${
              editMode && "self-start"
            }`}
          >
            <Button p={0} className="w-4 h-fit" onClick={upVoteFunc}>
              <img src="/src/assets/images/icon-plus.svg" alt="fad" />
            </Button>

            <Text className="text-primary-moderate-blue mx-3 md:mx-0 md:my-3">
              {r.score}
            </Text>
            <Button p={0} className="w-4 h-fit" onClick={downVoteFunc}>
              <img src="/src/assets/images/icon-minus.svg" alt="fad" />
            </Button>
          </Flex>
          <Stack w="100%">
            <Group>
              <Group>
                <Avatar src={r.user.image.png} alt="afa" />
                <Title order={5} className="text-neutral-dark-blue font-[700]">
                  {r.user.username}
                </Title>
                {r.user.username == "juliusomo" && (
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
                  {getTimeAgo(r.createdAt)}{" "}
                </Text>
              </Group>
              <Group className="absolute right-7 bottom-6 md:top-[30px] ml-auto items-start">
                {r.user.username == "juliusomo" && (
                  <Button
                    leftSection={
                      <img
                        src={"/src/assets/images/icon-delete.svg"}
                        alt="afa"
                      />
                    }
                    className=" text-primary-soft-red p-0  hover:opacity-50 duration-300"
                    onClick={() => handlers.open()}
                  >
                    Delete
                  </Button>
                )}
                {r.user.username != "juliusomo" ? (
                  <Button
                    leftSection={
                      <img
                        src={"/src/assets/images/icon-reply.svg"}
                        alt="afa"
                      />
                    }
                    className=" text-primary-moderate-blue p-0  hover:opacity-50 duration-300"
                    onClick={() => setReplyMode(!replyMode)}
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
              </Group>
              <Modal
              
                radius={10}
                opened={opened}
                onClose={() => handlers.close()}
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
                overlayProps={{ style: { opacity: 0.4 } }}
              >
                <Stack>
                  <Text className="text-neutral-grayish-blue">
                    Are you sure you want to delete this comment? This will
                    remove the comment and can't be undone.
                  </Text>
                  <Group>
                    <Button
                      className="bg-neutral-grayish-blue flex-1 h-10"
                      onClick={() => handlers.close()}
                    >
                      No, Cancel
                    </Button>
                    <Button
                      className="bg-primary-soft-red flex-1 h-10"
                      onClick={() => deleteReply(c, r.id)}
                    >
                      Yes, Delete
                    </Button>
                  </Group>
                </Stack>
              </Modal>
            </Group>
            {editMode ? (
              <>
                <Textarea
                  className="  flex-1"
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
                  className="self-end bg-primary-moderate-blue"
                  onClick={() => {
                    update(r.id);
                    setEditMode(!editMode);
                  }}
                >
                  UPDATE
                </Button>
              </>
            ) : (
              <Text className="text-neutral-grayish-blue">
                <span className="text-base text-primary-moderate-blue font-[700]">
                  @{r.replyingTo}{" "}
                </span>
                {r.content}
              </Text>
            )}
          </Stack>
        </Flex>
      </AnimatedPaper>
      {replyMode && (
        <UserReply
          c={c}
          r={r}
          data={data}
          setData={setData}
          setReplyMode={setReplyMode}
          replyMode={replyMode}
        />
      )}
    </>
  );
};

export default Replies;
