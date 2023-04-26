# Overview

This repository contains adjustments to the BigCommerce cornerstone theme. It takes the Special Items category and Special Item and adds additional functionality. An "Add All to Cart" button that updates the cart with all of the category products. And a conditionally rendered "Remove All From Cart" that clears the cart if it has items. Both utilizing the Storefront API.

As well as a hover effect that shows the second image of the product.


## Findings

Being the first time I've worked with BigCommerce, Stencil, and Handlebars this was a big bite. 

As I broke it down over the course of a few days I was able to start understanding my environment and the basics of making requests with BC. 

Stencil utils have been a major blocker for me. I seem to have access to the object but can't seem to use the associated helper functions. My best guess is that I'm not properly loading or initializing it at this time.

I set up a script and a simple express server to make requests for fetching the category and it's products. I would create a cart on the backend and then return it to the frontend.

The frontend would then clone and update the client side cart. 

I use a "window.location.reload()" for now to imitate the refreshContent util.

I have not yet got to the bonus task of adding a handlebars banner, but plan to keep working on that when I figure out my Stencil Utils blocker.

Thanks for checking out my progress so far!


### Code

1. Script: [Link](https://github.com/bigolboyyo/BC-Stencil-test/blob/main/assets/js/theme/customScript.js)
2. Server: [Link](https://github.com/bigolboyyo/BC-Stencil-test/blob/main/server.mjs)
3. Category: [Link](https://github.com/bigolboyyo/BC-Stencil-test/blob/main/templates/pages/category.html) - Add button and load script


### Goals

1. Add handlebars banner
2. Implement Stencil Utils