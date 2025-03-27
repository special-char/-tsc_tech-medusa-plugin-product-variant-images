<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa Plugin Starter
</h1>


<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
</p>

## Compatibility

This starter is compatible with versions >= 2.4.0 of `@medusajs/medusa`. 



## Installation

To install the @tsc_tech/medusa-plugin-product-variant-images, run the following command:

```
npm install @tsc_tech/medusa-plugin-product-variant-images
```

OR

```
yarn add @tsc_tech/medusa-plugin-product-variant-images
```

## Configuration

Step 1: Update Medusa Configuration Modify your medusa-config.ts to include the product variant images plugin:

```
module.exports = defineConfig({
  plugins: [
    {
      resolve: "@tsc_tech/medusa-plugin-product-variant-images",
      options: {},
    },
    ],
})
```

Step 2: Run Migrations

```
npx medusa db:migrate
```

## How to Use

## Adding a Product Variant Images via Admin Dashboard

1. Log in to the Medusa Admin panel.

2. Navigate to Products in the sidebar.

3. Open Product Detail page and navigate to Variant Images Section

4. From the menu on the top, Edit Media and add the media you want to display for the variant images and Save.

5. From the menu on the top, Edit Thumbnail and select the desired thumbnail and Save.


## Community & Contributions

The community and core team are available in GitHub Discussions, where you can ask for support, discuss roadmap, and share ideas.
