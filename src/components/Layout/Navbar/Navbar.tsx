import {
  AppBar,
  Button,
  makeStyles,
  Tab,
  Tabs,
  Theme,
  Toolbar,
} from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { destroyCookie } from "nookies";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { apiRoutes } from "../../../consts/apiRoutes";
import { pageRoutes } from "../../../consts/pageRoutes";
import useMeQuery from "../../../hooks/react-query/auth/useMeQuery";
import useSnackbarStore from "../../../hooks/stores/useSnackbarStore";
import myClientAxios from "../../../utils/axios/myClientAxios";
import Flex from "../../Shared/Flexboxes/Flex";
import FlexVCenter from "../../Shared/Flexboxes/FlexVCenter";
import Txt from "../../Shared/Text/Txt";
import AuthDialog from "./AuthDialog/AuthDialog";
import SidebarToggleButton from "./SidebarToggleButton";

// PE 2/3
const Navbar = () => {
  const classes = useStyles();
  const router = useRouter();

  const { data: authUser, isLoading } = useMeQuery({refetchOnWindowFocus: false, retry: false});

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

  const shouldShowLogin = !authUser && !isLoading;

  return (
    <AppBar className={classes.root} position="fixed" elevation={0}>
      <Toolbar className={classes.toolbar}>
        <FlexVCenter>
          <SidebarToggleButton />
          {isLoading && "Loading..."}
          {shouldShowLogin && (
            <Button onClick={() => setOpenAuthDialog(true)}>Login</Button>
          )}
          {authUser && <Button onClick={logout}>Logout</Button>}

          {authUser && (
            <Flex>
              <Txt>{authUser.username} logged!!</Txt>

              <Flex>
                <Tabs
                  className={classes.tabs}
                  value={tabIndex}
                  indicatorColor="primary"
                  textColor="primary"
                  aria-label="disabled tabs example"
                >
                  <Link href={pageRoutes.index} passHref>
                    <Tab
                      id="index-tab"
                      className={classes.tab}
                      label={`Home`}
                    />
                  </Link>
                  <Link href={pageRoutes.draft} passHref>
                    <Tab
                      id="draft-tab"
                      className={classes.tab}
                      label={`Draft`}
                    />
                  </Link>
                </Tabs>
              </Flex>
            </Flex>
          )}

          <AuthDialog
            open={openAuthDialog}
            onClose={() => setOpenAuthDialog(false)}
          />
        </FlexVCenter>
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
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

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
  },
}));

export default Navbar;
