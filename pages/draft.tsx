import {
  Box,
  Container, makeStyles
} from "@material-ui/core";
import classNames from "classnames";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React from "react";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import DraftSelector from "../src/components/domain/draft/DraftSelector";
import Layout from "../src/components/Layout/Layout";
import Flex from "../src/components/Shared/Flexboxes/Flex";
import MySidebar from "../src/components/Shared/MySidebar";
import { apiRoutes } from "../src/consts/apiRoutes";
import useChampionsQuery, {
  fetchChampions
} from "../src/hooks/react-query/auth/useChampionsQuery";
import { fetchMe } from "../src/hooks/react-query/auth/useMeQuery";
import useSidebarStore from "../src/hooks/stores/useSidebarStore";
import myServerAxios from "../src/utils/axios/myServerAxios";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx); // Add logic to extract token from `req.headers.cookie`
  const userStr = cookies.user;
  // const authUser = JSON.parse(userStr) as AuthUserGetDto

  if (!userStr) {
    // Redirect to index page
    return {
      redirect: {
        destination: "/",
        statusCode: 302,
      },
    };
  }
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(apiRoutes.auth.me, () =>
    fetchMe(myServerAxios(ctx))
  );

  await queryClient.prefetchQuery(apiRoutes.lolRates, () =>
    fetchChampions(myServerAxios(ctx))
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const DraftPage = () => {
  const classes = useStyles();

  const { sidebarIsOpen } = useSidebarStore();

  const { data: response } = useChampionsQuery();

  return (
    <Layout>
      <Flex height="100%">
        <MySidebar />

        <Box
          className={classNames(classes.content, {
            [classes.contentShift]: sidebarIsOpen,
          })}
          flexGrow={1}
        >
          <Container style={{ maxWidth: 600 }}>
            <Box>
              {response && response.rates.length > 0 && (
                <DraftSelector rates={response.rates} />
              )}
            </Box>
          </Container>
        </Box>
      </Flex>
    </Layout>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,

    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 300,
  },
}));

export default DraftPage;