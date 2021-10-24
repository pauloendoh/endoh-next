import {
  AppBar,
  Box,
  Button,
  makeStyles,
  Tab,
  Tabs,
  Theme,
  Toolbar,
} from "@material-ui/core";
import classNames from "classnames";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { destroyCookie } from "nookies";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import useMeQuery from "../../../../hooks/react-query/domain/auth/useMeQuery";
import useSnackbarStore from "../../../../hooks/zustand-stores/useSnackbarStore";
import { apiRoutes } from "../../../../utils/apiRoutes";
import myClientAxios from "../../../../utils/axios/myClientAxios";
import { pageRoutes } from "../../../../utils/pageRoutes";
import { urls } from "../../../../utils/urls";
import NextImage from "../../next-overrides/NextImage/NextImage";
import NextLink from "../../next-overrides/NextLink/NextLink";
import AuthDialog from "./AuthDialog/AuthDialog";
import S from "./Navbar.styles";
import SidebarToggleButton from "./SidebarToggleButton";

// PE 2/3
const Navbar = () => {
  const classes = useStyles();

  const { data: authUser, isLoading } = useMeQuery({
    refetchOnWindowFocus: false,
    retry: false,
  });

  const [openAuthDialog, setOpenAuthDialog] = useState(false);

  const { pathname } = useRouter();
  const [tabIndex, setTabIndex] = useState<number | boolean>(false);

  const { setSuccessMessage } = useSnackbarStore();

  useEffect(() => {
    if (pathname.startsWith(pageRoutes.draft)) {
      setTabIndex(1);
    } else setTabIndex(0);
  }, [pathname]);

  const queryClient = useQueryClient();
  const logout = () => {
    // put this into an utils?...
    destroyCookie(null, "user");
    delete myClientAxios.defaults.headers["x-auth-token"];
    queryClient.setQueryData(apiRoutes.auth.me, null);
    setSuccessMessage("Successful logout!");
  };

  const isLoggedOut = !authUser && !isLoading;

  return (
    <AppBar className={classes.root} position="fixed" elevation={0}>
      <Toolbar
        className={classes.toolbar}
        style={{
          justifyContent: "space-between",
        }}
      >
        <S.LeftIcons>
          <SidebarToggleButton />

          <Box ml={2} />
          <NextLink href={urls.pages.index}>
            <a>
              <NextImage
                src={urls.image("fire-icon-league.png")}
                width="16px"
                height="20px"
              />
            </a>
          </NextLink>
        </S.LeftIcons>

        {authUser && (
          <Tabs
            className={classes.tabs}
            value={tabIndex}
            indicatorColor="primary"
            textColor="primary"
          >
            <Link href={pageRoutes.index} passHref>
              {/* PE 1/3 - DRY */}
              <Tab
                id="home-tab"
                className={classNames(classes.tab, {
                  [`${classes.selectedTab}`]: tabIndex === 0,
                })}
                label={`Home`}
              />
            </Link>
            <Link href={pageRoutes.draft} passHref>
              <Tab
                id="draft-tab"
                label={`Draft`}
                className={classNames(classes.tab, {
                  [`${classes.selectedTab}`]: tabIndex === 1,
                })}
              />
            </Link>
          </Tabs>
        )}

        <S.RightIcons>
          {isLoading && "Loading..."}
          {isLoggedOut && (
            <Button onClick={() => setOpenAuthDialog(true)}>Login</Button>
          )}
          {authUser && <Button onClick={logout}>Logout</Button>}

          <AuthDialog
            open={openAuthDialog}
            onClose={() => setOpenAuthDialog(false)}
          />
        </S.RightIcons>
      </Toolbar>
    </AppBar>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    background: "#202020",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    zIndex: 1201,
  },
  toolbar: {},

  fireIcon: {
    color: theme.palette.secondary.main,
    height: "24px !important",
    width: "18px !important",
  },

  tabs: {
    // minHeight: 32,
    position: "relative",
    top: 5,
    zIndex: 1202,
  },
  tab: {
    fontSize: 16,
    paddingBottom: 16,
    minWidth: "inherit",
    width: "inherit",
    color: "white",
    opacity: 1,
  },
  selectedTab: {
    color: theme.palette.primary.main,
  },
}));

export default Navbar;