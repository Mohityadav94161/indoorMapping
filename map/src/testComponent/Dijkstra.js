import { MinHeap } from "./MinHeap";

export const dijkstra = (graph, mapping, startPoint, endPoint) => {
    const minHeap = new MinHeap();
    const distances = {}; // Stores the minimum distance to each point
    const previous = {}; // Keeps track of the shortest path
    const visited = new Set(); // Tracks visited nodes

    // Initialize distances to infinity and the start point to 0
    for (const point in graph) {
        distances[point] = Infinity;
        previous[point] = null;
    }
    distances[startPoint] = 0;

    // Insert the start point into the priority queue
    minHeap.insert({ point: startPoint, weight: 0 });

    while (!minHeap.isEmpty()) {
        const current = minHeap.extractMin();
        const currentPoint = current.point;

        // Skip processing if already visited
        if (visited.has(currentPoint)) continue;

        // Mark the current point as visited
        visited.add(currentPoint);

        // Stop early if we reached the destination
        if (currentPoint === endPoint) break;

        // Explore neighbors
        for (const neighbor of graph[currentPoint]) {
            const { to: neighborPoint, weight } = neighbor;
            const totalDistance = distances[currentPoint] + weight;

            // Update the distance if it's shorter
            if (totalDistance < distances[neighborPoint]) {
                distances[neighborPoint] = totalDistance;
                previous[neighborPoint] = currentPoint;
                minHeap.insert({ point: neighborPoint, weight: totalDistance });
            }
        }
    }

    // Reconstruct the path from the `previous` map
    const path = [];
    let current = endPoint;
    while (current) {
        path.push(current);
        current = previous[current];
    }

    // Reverse the path to go from startPoint to endPoint
    const pointPath = path.reverse();

    // Map the path to coordinates using the mapping array
    const coordinatePath = pointPath.map((point) => {
        const match = mapping.find((p) => p.name === point);
        return match ? match.coordinates : null;
    });

    return coordinatePath.filter((coordinates) => coordinates !== null); // Remove any unmatched points
};
