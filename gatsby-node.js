const path = require('path')
// HACK!
let gql

exports.createPages = ({ boundActionCreators, graphql }) => {
  gql = graphql
  const { createPage } = boundActionCreators

  const eventPages = new Promise((resolve, reject) => {
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
                metaDescription
                startsAt
                endsAt
                coverPhoto
                
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
                  image
                  price
                }
              }
            }
          }
        }
    `
      ).then(result => {
        if (result.errors) {
          console.error(result.errors)
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

  // const competitionPages = new Promise((resolve, reject) => {
  //   const competitionPageTemplate = path.resolve('src/templates/competition.js')
  //   // Query for markdown nodes to use in creating pages.
  //   resolve(
  //     graphql(`{
  //     allCompetition {
  //       edges {
  //         node {
  //           id
  //           name
  //           items {
  //             author
  //             authorPhoto
  //             url
  //           }
  //         }
  //       }
  //     }
  //   }`).then(result => {
  //         if (result.errors) {
  //           console.error(result.errors)
  //           reject(result.errors)
  //         }
          
  //         // Create pages for each markdown file.
  //         result.data.allCompetition.edges.forEach(({ node }) => {
  //           const path = `/contests/${node.id}`
  //           console.log(path)
            
  //           createPage({
  //             path,
  //             component: competitionPageTemplate,
  //             context: {
  //               competitionId: node.id,
  //               preloadedCompetition: node,
  //             },
  //           })
  //         })
  //       })
  //   )
  // })

  const blogPostTemplate = path.resolve('src/templates/content.js')

  const postPages = graphql(`
    {
      allMarkdownRemark(
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    return result.data.allMarkdownRemark.edges.map(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: blogPostTemplate,
        context: {}, // additional data can be passed via context
      })
    })
  })
  
  return Promise.all([eventPages, Promise.all(postPages)/*, competitionPages*/])
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

exports.modifyBabelrc = ({ babelrc }) => ({
  ...babelrc,
  plugins: babelrc.plugins.concat(['transform-regenerator']),
})
