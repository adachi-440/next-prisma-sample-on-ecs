import React from "react"
import {
  // GetStaticProps,
  GetServerSideProps,
} from "next"
import Layout from "../components/Layout"
// import Post, { PostProps } from "../components/Post"

import { prisma } from "../lib/prisma";

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {

  // TODO: "await (await prisma)"以外に方法ないか調べる
  const count = await (await prisma).user.count();
  const data = await (await prisma).user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      posts: true,
    },
  });
  const users = JSON.parse(JSON.stringify(data));
  return {
    props: {
      count,
      users,
    },
  };
};

type Props = {
  count: number;
  users: { "id", "name", "email", "createdAt", "updatedAt" }[];
};

const Select: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Postgres select</h1>
        <main>
          <div>user count: {props.count}</div>;

          {props.users.map((user) => (
            <div key={user.id} className="user">
              {user.id ?? ''}
              {user.email ?? ''}
              {user.name ?? ''}
              {user.createdAt ?? ''}
              {user.updatedAt ?? ''}
            </div>
          ))}
        </main>
      </div>
    </Layout>
  )
}

export default Select
