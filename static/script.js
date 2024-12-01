window.onload = function () {
    const canvas = document.getElementById('floor-plan');
    const ctx = canvas.getContext('2d');
    const floorPlanImage = document.getElementById('floor-plan-image');

    // Map point SVG converted to base64
    const mapPointSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="96px" height="96px">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>`;
    const mapPointIcon = new Image();
    mapPointIcon.src = 'data:image/svg+xml;base64,' + btoa(mapPointSvg);

    // All locations and elevators
    const locations = {
        "Entrance": { x: 1572, y: 1112, floor: 1 },
        "Faculty and Staff Restroom": { x: 1460, y: 1110, floor: 1 },
        "CA Department": { x: 1376, y: 1110, floor: 1 },
        "IT Department": { x: 1228, y: 1110, floor: 1 },
        "IS Department": { x: 1086, y: 1110, floor: 1 },
        "CS Department": { x: 972, y: 1110, floor: 1 },
        "Student Lounge": { x: 534, y: 1110, floor: 1 },
        "Faculty Lounge": { x: 398, y: 1110, floor: 1 },
        "Dean's Office": { x: 224, y: 1110, floor: 1 },
        "Women's Restroom": { x: 136, y: 1110, floor: 1 },
        "Exit": { x: 50, y: 1112, floor: 1 },
        "Room": { x: 1478, y: 852, floor: 2 },
        "Database Laboratory": { x: 1404, y: 852, floor: 2 },
        "CCS Guidance": { x: 1258, y: 852, floor: 2 },
        "Maintenance Sec": { x: 1184, y: 852, floor: 2 },
        "Dev Sec": { x: 1122, y: 852, floor: 2 },
        "ICTC": { x: 988, y: 852, floor: 2 },
        "Network Laboratory": { x: 574, y: 852, floor: 2 },
        "IOT Laboratory": { x: 462, y: 852, floor: 2 },
        "Multimedia Laboratory": { x: 342, y: 852, floor: 2 },
        "CS Laboratory": { x: 220, y: 852, floor: 2 },
        "Men's Restroom": { x: 136, y: 852, floor: 2 },
        "ICT3A": { x: 226, y: 598, floor: 3 },
        "ICT3B": { x: 344, y: 598, floor: 3 },
        "ICT3C": { x: 472, y: 598, floor: 3 },
        "ICT3D": { x: 578, y: 598, floor: 3 },
        "Tool Room": { x: 946, y: 598, floor: 3 },
        "Storage Room": { x: 1006, y: 598, floor: 3 },
        "Research Laboratory": { x: 1064, y: 598, floor: 3 },
        "Embedded Laboratory": { x: 1206, y: 598, floor: 3 },
        "ICT3H": { x: 1358, y: 598, floor: 3 },
        "Men's Faculty Restroom": { x: 1476, y: 598, floor: 3 },
        "Women's Restroom(3rd floor)": { x: 138, y: 598, floor: 3 },
        "4th Floor": { x: 702, y: 332, floor: 4 }
    };

    const elevatorLocations = {
        1: { x: 674, y: 1110 }, // Ground floor elevator
        2: { x: 674, y: 854 },  // Second floor elevator
        3: { x: 674, y: 598 },  // Third floor elevator
        4: { x: 674, y: 332 }   // Fourth floor elevator
    };

    // Setup canvas when the image is loaded
    floorPlanImage.onload = function () {
        setupCanvas();
        drawFloorPlan();
    };

    if (floorPlanImage.complete) {
        setupCanvas();
        drawFloorPlan();
    }

    function setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const maxDisplayWidth = 800;
        const maxDisplayHeight = 600;
        const widthRatio = maxDisplayWidth / floorPlanImage.naturalWidth;
        const heightRatio = maxDisplayHeight / floorPlanImage.naturalHeight;
        const scaleFactor = Math.min(widthRatio, heightRatio);

        canvas.width = floorPlanImage.naturalWidth * scaleFactor * dpr;
        canvas.height = floorPlanImage.naturalHeight * scaleFactor * dpr;
        canvas.style.width = `${floorPlanImage.naturalWidth * scaleFactor}px`;
        canvas.style.height = `${floorPlanImage.naturalHeight * scaleFactor}px`;
        ctx.scale(dpr * scaleFactor, dpr * scaleFactor);
    }

    function drawFloorPlan() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(floorPlanImage, 0, 0, floorPlanImage.naturalWidth, floorPlanImage.naturalHeight);
    }

    function drawMapPoint(x, y) {
        const iconSize = 100; // Size of the map point icon
        ctx.drawImage(mapPointIcon, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
    }

    function drawPath(start, end) {
        drawFloorPlan();
        drawMapPoint(start.x, start.y);
        drawMapPoint(end.x, end.y);

        let path = calculatePath(start, end);

        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);

        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }

        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 16;
        ctx.stroke();
    }

    function calculatePath(start, end) {
        const path = [start];

        if (start.floor !== end.floor) {
            // Add path to the nearest elevator on the starting floor
            path.push(elevatorLocations[start.floor]);

            // Add path to the elevator on the destination floor
            path.push(elevatorLocations[end.floor]);
        }

        // Add the final destination point
        path.push(end);

        return path;
    }

    function calculateDistance(path) {
        let totalDistance = 0;

        for (let i = 0; i < path.length - 1; i++) {
            const dx = path[i + 1].x - path[i].x;
            const dy = path[i + 1].y - path[i].y;
            totalDistance += Math.sqrt(dx * dx + dy * dy);
        }

        return totalDistance * 0.0494; // Scale factor for distance in meters
    }

    function estimateTime(distance) {
        const averageWalkingSpeed = 1.4; // meters per second
        return distance / averageWalkingSpeed; // time in seconds
    }

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }

    window.calculatePath = function () {
        const currentLocation = document.getElementById('current-location').value;
        const destination = document.getElementById('destination').value;

        try {
            if (currentLocation === destination) {
                throw new Error("Current location and destination cannot be the same.");
            }

            if (locations[currentLocation] && locations[destination]) {
                const start = locations[currentLocation];
                const end = locations[destination];

                // Calculate the path
                const path = calculatePath(start, end);

                // Draw the path
                drawPath(start, end);

                // Calculate distance and time
                const distance = calculateDistance(path);
                const timeInSeconds = estimateTime(distance);

                // Convert time to minutes and seconds
                const minutes = Math.floor(timeInSeconds / 60);
                const seconds = Math.round(timeInSeconds % 60);

                // Display results
                document.getElementById('distance').textContent = `Estimated Distance: ${distance.toFixed(2)} meters`;
                document.getElementById('time').textContent = `Estimated Time: ${minutes} minutes ${seconds} seconds`;

                // Voice output
                const alertText = `The estimated distance is ${distance.toFixed(2)} meters and the estimated time is ${minutes} minutes and ${seconds} seconds.`;
                speak(alertText);
            } else {
                throw new Error("Invalid locations selected.");
            }
        } catch (error) {
            alert(error.message);
        }
    };
};

