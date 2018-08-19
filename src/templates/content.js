import React from "react";

import styled from "styled-components";
import { Container, Panel, Box, Flex } from "../components/Layout";

import Link from 'gatsby-link'

export default function Template({
  data // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark, allMarkdownRemark } = data; // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark;
  const { edges } = allMarkdownRemark;

  return (
    <div>
      <Jumbotron style={{ backgroundImage: `url(${frontmatter.cover})` }}>
        <h1 className="farsi">{frontmatter.title}</h1>
      </Jumbotron>
      <Container>
        <Flex style={{ marginTop: 50 }}>
          <Box width={[1, 8/12]} pr={[0, 10]}>
            <BlogPostPanel>
              <div
                className="blog-post-content"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </BlogPostPanel>
          </Box>
          <Box width={[1, 4/12]} pl={[0, 10]}>
            <RelatedContentPanel className="farsi">
              <h2>سایر مطالب</h2>
              <RelatedPostsList>
                {
                  edges.map(
                    ({ node: { frontmatter: page } }) => (
                      <li>
                        <Link activeClassName="active" to={page.path}>{page.title}</Link>
                      </li>
                    )
                  )
                }
              </RelatedPostsList>
            </RelatedContentPanel>
          </Box>
        </Flex>
      </Container>
    </div>
  );
}

const BlogPostPanel = styled(Panel)`
  padding: 30px 30px;
  margin-bottom: 50px;
  direction: rtl;

  &,
  h1,
  h2,
  h3,
  h4,
  h5 {
    font-family: Vazir, tahoma, sans-serif;
  }

  ol {
    margin-right: 1.45rem;
  }

  a {
    font-weight: 600;
    display: inline-block;
    border-bottom: 2px solid #e0d6eb;
    text-decoration: none;
    color: black;

    &:hover {
      opacity: 0.7;
      background: #e0d6eb;
    }
  }
`;

const RelatedContentPanel = styled(Panel)`
  a {
    font-weight: 400;
    display: inline-block;
    text-decoration: none;
    color: black;
    border-bottom: 2px solid #e0d6eb;

    &:not(.active) {
      border-color: transparent;

      &:hover {
        opacity: 0.7;
        background: #e0d6eb;
      }
    }

    &.active {
      font-weight: 700;
      cursor: inherit;
    }
  }
`

const RelatedPostsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

const Jumbotron = styled.div`
  position: relative;
  background-color: #334a75;
  background-blend-mode: multiply;
  background-size: cover;
  background-position: center 60%;
  padding: 60px 0;
  text-align: center;
  color: white;
  margin-bottom: 50px;
  text-shadow: 0 0 25px #000;

  h1 {
    font-weight: 400;
    font-size: 2.5em;
  }

  h2 {
    font-weight: 300;
  }
`;

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
        cover
        direction
      }
    }

    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            title
            path
          }
        }
      }
    }
  }
`;
