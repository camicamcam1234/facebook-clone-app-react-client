import React, { Fragment, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PostContext, UIContext, UserContext } from '../App'
import {
  List,
  ListItemIcon,
  Avatar,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@material-ui/core'
import Sidebar from '../components/Sidebar'
import WritePostCard from '../components/Post/PostForm/WritePostCard'

import { homeLeftItems } from '../Data/Home'

import DrawerBar from '../components/Navbar/DrawerBar'
import { fetchAllPosts } from '../services/PostServices'
import AvartarText from '../components/UI/AvartarText'

import Posts from '../components/Post/Posts'
import MyFriendLists from '../components/Friends/MyFriendLists'

function Home() {
  const { uiState, uiDispatch } = useContext(UIContext)
  const { userState, userDispatch } = useContext(UserContext)
  const { postDispatch, postState } = useContext(PostContext)
  const theme = useTheme()
  const match = useMediaQuery(theme.breakpoints.between(960, 1400))

  useEffect(() => {
    uiDispatch({ type: 'SET_NAV_MENU', payload: true })
    uiDispatch({ type: 'SET_DRAWER', payload: false })

    async function loadPosts() {
      const res = await fetchAllPosts()
      if (res.data) {
        postDispatch({ type: 'SET_POSTS', payload: res.data.posts })
      }
    }

    loadPosts()

    return () => {
      uiDispatch({ type: 'SET_NAV_MENU', payload: false })
      uiDispatch({ type: 'SET_DRAWER', payload: false })
    }
  }, [])

  return (
    <div>
      {uiState.mdScreen ? (
        <Fragment>
          <Sidebar
            anchor="left"
            background={
              !uiState.darkMode ? 'rgb(240,242,245)' : 'rgb(24,25,26)'
            }
            boxShadow={false}
          >
            <List>
              <ListItem
                button
                component={Link}
                to={`/profile/${userState.currentUser.id}`}
              >
                <ListItemIcon>
                  {userState.currentUser.profile_pic ? (
                    <Avatar
                      style={{
                        width: '50px',
                        height: '50px',
                      }}
                    >
                      <img
                        src={userState.currentUser.profile_pic}
                        width="100%"
                        height="100%"
                      />
                    </Avatar>
                  ) : (
                    <AvartarText
                      text={userState.currentUser.name}
                      bg={userState.currentUser.active ? 'seagreen' : 'tomato'}
                    />
                  )}
                </ListItemIcon>
                <ListItemText
                  style={{ marginLeft: '6px' }}
                  primary={userState.currentUser.name}
                />
              </ListItem>
              {homeLeftItems.map((list, index) => (
                <ListItem button key={index} component={Link} to={list.to}>
                  <ListItemIcon>
                    <Avatar
                      alt={list.title}
                      src={require(`../assets/${list.img}`)}
                    />
                  </ListItemIcon>
                  <ListItemText primary={list.title} />
                </ListItem>
              ))}
            </List>
          </Sidebar>
          <Sidebar
            anchor="right"
            background={
              !uiState.darkMode ? 'rgb(240,242,245)' : 'rgb(24,25,26)'
            }
            boxShadow={false}
            drawerWidth={380}
          >
            <MyFriendLists />
          </Sidebar>
        </Fragment>
      ) : (
        <DrawerBar>
          <MyFriendLists />
        </DrawerBar>
      )}

      <div
        style={{
          maxWidth: uiState.mdScreen ? (match ? '45vw' : '38vw') : '100vw',
          padding: !uiState.mdScreen && '0px 4px 0px 4px',
          margin: 'auto',
          paddingTop: '100px',
          paddingBottom: '100px',
          minHeight: '100vh',
        }}
      >
        <WritePostCard user={userState.currentUser} />

        <Posts posts={postState.posts} />
      </div>
    </div>
  )
}

export default Home