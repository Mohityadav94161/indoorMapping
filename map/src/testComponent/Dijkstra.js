import { MinHeap } from "./MinHeap";

export const dijkstra = (graph, points, startPoint, endPoint, mapping) => {
    const minHeap = new MinHeap();
    const distances = {}; // Stores the minimum distance to each point
    const previous = {}; // Keeps track of the shortest path
    const visited = new Set(); // Tracks visited nodes

    const start = points.find((p) => p.id === startPoint);
    const end = points.find((p) => p.id === endPoint);


    // Preprocess relations to use IDs instead of names
    const idMapping = mapping.map((relation) => {
        const point1 = points.find((p) => p.name === relation.point1);
        const point2 = points.find((p) => p.name === relation.point2);

        if (!point1 || !point2) {
            console.warn(`Relation with invalid points: ${relation.point1}, ${relation.point2}`);
            return null;
        }

        return {
            point1: point1.id, // Replace name with ID
            point2: point2.id, // Replace name with ID
        };
    }).filter((relation) => relation !== null);

    // Debug: Ensure start and end points are valid
    if (!start || !end) {
        console.error("Start or end point is invalid!");
        return [];
    }

    const startLevel = start.level;
    const endLevel = end.level;

    // Initialize distances for all points across levels
    for (const level in graph) {
        for (const point in graph[level]) {
            distances[`${level}*${point}`] = Infinity;
            previous[`${level}*${point}`] = null;
        }
    }
    distances[`${startLevel}*${startPoint}`] = 0; // Start point has distance 0

    // Debug: Log initialized distances
    console.log("Initialized distances:", distances);

    // Insert the start point into the priority queue
    minHeap.insert({ point: `${startLevel}*${startPoint}`, weight: 0 });

    while (!minHeap.isEmpty()) {
        const current = minHeap.extractMin();
        const [currentLevel, currentPoint] = current.point.split('*');

        // Debug: Log the extracted point
        console.log("Processing point:", currentLevel, currentPoint);

        // Skip processing if already visited
        if (visited.has(current.point)) {
            console.log(`Point ${current.point} already visited. Skipping.`);
            continue;
        }

        // Mark the current point as visited
        visited.add(current.point);

        // Stop early if we reached the destination
        if (currentPoint === endPoint && parseInt(currentLevel, 10) === endLevel) {
            console.log("Destination reached!");
            break;
        }

        // Explore neighbors in the same level
        console.log("Exploring neighbors for point:", currentPoint);
        for (const neighbor of graph[currentLevel][currentPoint] || []) {
            const { to: neighborPoint, weight } = neighbor;
            const neighborKey = `${currentLevel}*${neighborPoint}`;
            const totalDistance = distances[current.point] + weight;

            // Debug: Log comparison of distances
            console.log(
                `Neighbor: ${neighborPoint}, Current Distance: ${distances[neighborKey]}, New Distance: ${totalDistance}`
            );

            if (totalDistance < distances[neighborKey]) {
                distances[neighborKey] = totalDistance;
                previous[neighborKey] = current.point;

                // Debug: Log the neighbor being added to the heap
                console.log("Adding to heap:", { point: neighborKey, weight: totalDistance });
                minHeap.insert({ point: neighborKey, weight: totalDistance });
            }
        }

        // Explore inter-level connections via mapping
        console.log("Exploring inter-level connections for:", currentPoint);
        const interLevelConnections = idMapping.filter(
            (relation) => relation.point1 === currentPoint || relation.point2 === currentPoint
        );

        for (const connection of interLevelConnections) {
            const targetPoint = connection.point1 === currentPoint ? connection.point2 : connection.point1;
            const target = points.find((p) => p.id === targetPoint);
            if (!target) continue;

            const targetLevel = target.level;
            const interLevelKey = `${targetLevel}*${target.id}`;
            const interLevelDistance = distances[current.point] + 1; // Fixed weight for inter-level connection

            // Debug: Log inter-level connection check
            console.log(
                `Inter-Level: ${currentPoint} -> ${targetPoint} (Level ${targetLevel}), Current Distance: ${distances[interLevelKey]}, New Distance: ${interLevelDistance}`
            );

            if (interLevelDistance < distances[interLevelKey]) {
                distances[interLevelKey] = interLevelDistance;
                previous[interLevelKey] = current.point;

                // Debug: Log the inter-level connection being added to the heap
                console.log("Adding inter-level to heap:", {
                    point: interLevelKey,
                    weight: interLevelDistance,
                });
                minHeap.insert({ point: interLevelKey, weight: interLevelDistance });
            }
        }
    }

    // Reconstruct the path from the `previous` map
    const path = [];
    let current = `${endLevel}*${endPoint}`;
    while (current) {
        path.push(current);
        current = previous[current];
    }

    // Debug: Log the reconstructed path
    console.log("Reconstructed path:", path);

    // Reverse the path to go from startPoint to endPoint
    const pointPath = path.reverse();

    // Map the path to coordinates using the points array
    const coordinatePath = pointPath.map((key) => {
        const [level, pointId] = key.split('*');
        const match = points.find((p) => p.id === pointId && p.level === parseInt(level, 10));
        return match ? match.coordinates : null;
    });

    // Debug: Log the final coordinate path
    console.log("Coordinate Path:", coordinatePath);

    // Return the coordinate path, excluding null values
    return coordinatePath.filter((coordinates) => coordinates !== null);
};
