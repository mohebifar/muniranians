const path = require('path')
// HACK!
let gql

exports.createPages = ({ boundActionCreators, graphql }) => {
  gql = graphql
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    const eventPageTemplate = path.resolve('src/templates/event.js')
    // Query for markdown nodes to use in creating pages.
    resolve(
      graphql(
        `
        {
          allEvent {
            edges {
              node {
                id
                name
                faName
                description
                startsAt
                endsAt
                
                location {
                  address
                  lat
                  lon
                }
                
                tickets {
                  name
                  faName
                  subtitle
                  faSubtitle
                  quantity
                  price
                }
              }
            }
          }
        }
    `
      ).then(result => {
        if (result.errors) {
          reject(result.errors)
        }

        // Create pages for each markdown file.
        result.data.allEvent.edges.forEach(({ node }) => {
          const path = `/events/${node.id}`
          createPage({
            path,
            component: eventPageTemplate,
            context: {
              eventId: node.id,
              preloadedEvent: node,
            },
          })
        })
      })
    )
  })
}

// Override main page with events data
exports.onCreatePage = ({ page, boundActionCreators, graphql }) => {
  const { createPage, deletePage } = boundActionCreators

  return new Promise((resolve, reject) => {
    if (page.path === '/') {
      gql(
        `
        {
          allEvent {
            edges {
              node {
                id
                name
                startsAt
                endsAt
                
                location {
                  address
                }
              }
            }
          }
        }
    `
      ).then((result) => {
        if (result.errors) {
          reject(result.errors)
        }

        const newPage = {
          ...page,
          context: {
            events: result.data.allEvent.edges,
          },
        }

        deletePage(page)
        createPage(newPage)
        resolve()
      })
    } else {
      resolve()
    }
  })

}
