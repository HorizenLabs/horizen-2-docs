import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
 const sidebars: SidebarsConfig = {
  overviewSidebar: [
    {type: 'autogenerated', dirName: '1-overview'}
  ],
  apiSidebar: [
    {type: 'autogenerated', dirName: '2-api'}
  ],
  tutorialsSidebar: [
    {type: 'autogenerated', dirName: '3-tutorials'}
  ]
}


export default sidebars;
