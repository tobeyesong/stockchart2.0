# Stock Data Visualization and Optimization Project

## Overview

Initially developed a few years ago, this project focuses on the basic visualization of stock data. I revisited it intending to optimize the application, especially for handling large datasets. The primary enhancement involves implementing a Segment Tree for volume calculations.

## Segment Tree Implementation

Segment Trees are ideal for efficiently handling range queries, such as calculating average stock volumes over selected time periods. A Segment Tree can perform these operations in O(log n) time, which is significantly faster than the naive approach operating in O(n) time. This efficiency becomes increasingly critical as the dataset size grows.

Not too dissimilar to merge sort, the idea here is to break up the array into segments by a branching factor of two to be more precise and have each node represent a progressively smaller range. We break up the array into two equal halves, and each node represents a range (which are basically indices of arrays).

When a user views stock data over different time ranges (e.g., weekly, monthly, yearly), the application needs to quickly calculate the total volume or other aggregate metrics for that range. A naive approach would involve iterating through the data each time, which becomes inefficient as the dataset grows. The Segment Tree, however, allows these queries to be performed in logarithmic time, significantly improving performance.

# How I Implemented the Segment Tree

To integrate the Segment Tree into my React application, I first created a utility class that handled the tree's construction and the execution of range queries. The Segment Tree was built from the stock volume data, allowing me to quickly compute the sum of volumes over any given range.

## Overview of the Implementation

### Tree Construction

I first initialized a Segment Tree by segmenting the volume data available from the stock. These are stored along with aggregated values, like sums, at each node. The process constructs a tree representing the entire range of data so that each parent node covers a broader range than its children.

### Querying the Tree

After that, I could efficiently query any range of stock data. Because of the tree's structure, it is possible to skip large parts of the data not relevant to a query; hence, this makes the process a lot faster than an iteration over the complete dataset.

### Updates in the Tree

Given that changes in the data had occurred, a Segment Tree could be updated in logarithmic time to maintain the accuracy of the tree, rather than having to rebuild from scratch.


### Key Features:

- **SegmentTree Class**: This class stores summed data across ranges, enabling ultra-fast data retrieval for those ranges. The tree is constructed recursively.
- **React `useMemo` Hook**: I used React's' useMemo' hook to ensure that the Segment Tree is rebuilt only when the data changes.
- **Optimized Volume Calculations**: The `LineChartSection` component utilizes this Segment Tree to perform fast volume calculations, particularly when the user zooms and pans the chart.

## Algolia Integration

Initially, I considered implementing a convoluted system to update the Algolia index in real-time. However, I opted for a simpler solution: generating a JSON file with a single API call and then uploading it to Algolia. This process effectively created a makeshift database for all ticker symbols.

## Modular Design

Decoupling my components from responsibilities is one way that really helped me build a maintainable and scalable application. 

## Performance Comparison

To verify the effectiveness of the Segment Tree, I compared it against the naive approach by measuring elapsed time using `console.time()`. You can view the live result in the console. The results were as follows:

- **Faster Queries**: The Segment Tree method consistently outperformed the naive method in terms of query range, especially for longer data ranges.
- **Consistent Results**: The average results for both methods were identical, confirming the accuracy of the Segment Tree approach.
- **Quick Response**: After the initial API call, subsequent queries sped up significantly due to the Segment Tree.

## Live Demo

You can view a live, working version of the optimized stock data visualization and the Segment Tree for volume calculations here:

[Live Demo](https://2270termproject.netlify.app/)

## Conclusion

This project demonstrates the value of revisiting old projects with a fresh perspective. The original scaffolding laid a fundamental foundation for my work, and it made all of the difference. Implementing the Segment Tree significantly improved the app's performance and prepared it for long-term reprovisioning.

