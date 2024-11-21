export const dijkstra = (graph, start, end) => {
    const distances = {};
    const previous = {};
    const queue = new Set(Object.keys(graph));

    for (const node of queue) {
        distances[node] = Infinity;
        previous[node] = null;
    }
    distances[start] = 0;

    while (queue.size) {
        const current = [...queue].reduce((minNode, node) =>
            distances[node] < distances[minNode] ? node : minNode
        );

        if (current === end) break;
        queue.delete(current);

        for (const neighbor in graph[current]) {
            const alt = distances[current] + graph[current][neighbor];
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                previous[neighbor] = current;
            }
        }
    }

    const path = [];
    let curr = end;
    while (curr) {
        path.unshift(curr);
        curr = previous[curr];
    }
    return path;
};
