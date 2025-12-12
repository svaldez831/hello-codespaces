import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApolloProvider } from '@apollo/client/react/index.js'
import { ApolloClient, InMemoryCache } from '@apollo/client/core/index.js'
import PropTypes from 'prop-types'
import { HelmetProvider } from 'react-helmet-async'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { io } from 'socket.io-client'

const queryClient = new QueryClient()
const apolloClient = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URL,
  cache: new InMemoryCache(),
})

let socket = null

if (typeof window !== 'undefined') {
  socket = io(import.meta.env.VITE_SOCKET_HOST, {
    query: window.location.search.substring(1),
    auth: {
      token: window.localStorage.getItem('token'),
    },
  })

  socket.on('connect', () => {
    console.log('connected to socket.io as', socket.id)
    socket.emit('chat.message', 'hello from client')
  })

  socket.on('chat.message', (msg) => {
    console.log(`${msg.username}: ${msg.message}`)
  })

  socket.on('connect_error', (err) => {
    console.error('socket.io connect error:', err)
  })

  socket.on('post.created', (post) => {
    console.log('post.created event:', post)

    const toast = document.createElement('div')
    toast.style.position = 'fixed'
    toast.style.bottom = '20px'
    toast.style.right = '20px'
    toast.style.padding = '12px 16px'
    toast.style.background = '#333'
    toast.style.color = '#fff'
    toast.style.zIndex = '99999'
    toast.style.cursor = 'pointer'

    toast.innerHTML = `
    <div style="font-weight:600; margin-bottom:4px;">New post</div>
    <div style="font-size:12px; text-decoration:underline;">
      Click to open {' '}${post.title}
    </div>
  `
    toast.addEventListener('click', () => {
      window.location.href = post.url
    })

    document.body.appendChild(toast)

    setTimeout(() => {
      toast.remove()
    }, 7000)
  })
}

export function App({ children }) {
  return (
    <HelmetProvider>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>{children}</AuthContextProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </HelmetProvider>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
}
