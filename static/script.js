window.onload = function() {
    const canvas = document.getElementById('floor-plan');
    const ctx = canvas.getContext('2d');
    const floorPlanImage = document.getElementById('floor-plan-image');

    // SVG as a string for the map point icon
    const mapPointSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="96px" height="96px">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>`;

    const mapPointIcon = new Image();
    mapPointIcon.src = 'data:image/svg+xml;base64,' + btoa(mapPointSvg);

    floorPlanImage.onload = function() {
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
        const iconSize = 180; // Larger size for visibility
        ctx.drawImage(mapPointIcon, x - iconSize / 2, y - iconSize / 2, iconSize, iconSize);
    }

    function drawPath(start, end) {
        drawFloorPlan();
        drawMapPoint(start.x, start.y);
        drawMapPoint(end.x, end.y);

        const firstFloorLocations = [
            "Entrance", "Faculty and Staff Restroom", "CA Department", "IT Department",
            "IS Department", "CS Department", "Multi Tech Support", "Faculty Lounge",
            "Dean's Office", "Women's Restroom", "Exit"
        ];

        const secondFloorLocations = [
            "Room", "Database Laboratory", "CCS Guidance", "Maintenance Sec",
            "Dev Sec", "ICTC", "Network Laboratory", "IOT Laboratory",
            "Multimedia Laboratory", "CS Laboratory", "Men's Restroom"
        ];

        const thirdFloorLocations = [
            "ICT3A", "ICT3B", "ICT3C", "ICT3D", "ICT3E", "ICT3F",
            "Men's Faculty Restroom", "Women's Restroom(3rd floor)"
        ];

        const currentLocation = document.getElementById('current-location').value;
        const destination = document.getElementById('destination').value;

        const bothOnSameFloor = (firstFloorLocations.includes(currentLocation) && firstFloorLocations.includes(destination)) ||
                                (secondFloorLocations.includes(currentLocation) && secondFloorLocations.includes(destination)) ||
                                (thirdFloorLocations.includes(currentLocation) && thirdFloorLocations.includes(destination));

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);

        if (bothOnSameFloor) {
            ctx.lineTo(end.x, end.y);
        } else {
            const elevatorSecondFloor = { x: 1408, y: 1688 };
            const elevatorThirdFloor = { x: 1408, y: 1188 };
            const elevatorGroundFloor = { x: 1408, y: 2212 };

            let elevatorStart, elevatorEnd;

            if (thirdFloorLocations.includes(currentLocation)) {
                elevatorStart = elevatorThirdFloor;
            } else if (secondFloorLocations.includes(currentLocation)) {
                elevatorStart = elevatorSecondFloor;
            } else {
                elevatorStart = elevatorGroundFloor;
            }

            if (thirdFloorLocations.includes(destination)) {
                elevatorEnd = elevatorThirdFloor;
            } else if (secondFloorLocations.includes(destination)) {
                elevatorEnd = elevatorSecondFloor;
            } else {
                elevatorEnd = elevatorGroundFloor;
            }

            if (currentLocation === "4th Floor") {
                if (thirdFloorLocations.includes(destination)) {
                    elevatorStart = elevatorThirdFloor;
                } else if (secondFloorLocations.includes(destination)) {
                    elevatorStart = elevatorSecondFloor;
                } else if (firstFloorLocations.includes(destination)) {
                    elevatorStart = elevatorGroundFloor;
                }
            }

            if (destination === "4th Floor") {
                if (thirdFloorLocations.includes(currentLocation)) {
                    elevatorEnd = elevatorThirdFloor;
                } else if (secondFloorLocations.includes(currentLocation)) {
                    elevatorEnd = elevatorSecondFloor;
                } else if (firstFloorLocations.includes(currentLocation)) {
                    elevatorEnd = elevatorGroundFloor;
                }
            }

            ctx.lineTo(elevatorStart.x, start.y);
            ctx.lineTo(elevatorStart.x, elevatorStart.y);

            ctx.lineTo(elevatorEnd.x, elevatorEnd.y);
            ctx.lineTo(elevatorEnd.x, end.y);
            ctx.lineTo(end.x, end.y);
        }

        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 20;
        ctx.stroke();
    }

    const locations = {
        "Entrance": { x: 3220, y: 2220 },
        "Faculty and Staff Restroom": { x: 3008, y: 2220 },
        "CA Department": { x: 2788, y: 2220 },
        "IT Department": { x: 2556, y: 2220 },
        "IS Department": { x: 2300, y: 2220 },
        "CS Department": { x: 2048, y: 2220 },
        "Multi Tech Support": { x: 1168, y: 2220 },
        "Faculty Lounge": { x: 888, y: 2220 },
        "Dean's Office": { x: 600, y: 2220 },
        "Women's Restroom": { x: 356, y: 2220 },
        "Exit": { x: 104, y: 2220 },
        "Room": { x: 3000, y: 1700 },
        "Database Laboratory": { x: 2812, y: 1700 },
        "CCS Guidance": { x: 2604, y: 1700 },
        "Maintenance Sec": { x: 2460, y: 1700 },
        "Dev Sec": { x: 2304, y: 1700 },
        "ICTC": { x: 2084, y: 1700 },
        "Network Laboratory": { x: 1220, y: 1700 },
        "IOT Laboratory": { x: 1032, y: 1700 },
        "Multimedia Laboratory": { x: 776, y: 1700 },
        "CS Laboratory": { x: 536, y: 1700 },
        "Men's Restroom": { x: 388, y: 1700 },
        "ICT3A": { x: 524, y: 1188 },
        "ICT3B": { x: 780, y: 1188 },
        "ICT3C": { x: 1064, y: 1188 },
        "ICT3D": { x: 1264, y: 1188 },
        "ICT3E": { x: 2184, y: 1188 },
        "ICT3F": { x: 2752, y: 1188 },
        "Men's Faculty Restroom": { x: 3004, y: 1188 },
        "Women's Restroom(3rd floor)": { x: 360, y: 1188 },
        "4th Floor": { x: 1436, y: 684 }
    };

    function calculateDistance(start, end) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const scaleFactor = 0.0295;
    return Math.sqrt(dx * dx + dy * dy) * scaleFactor;
    }

    function estimateTime(distance) {
        const averageWalkingSpeed = 1.4; // meters per second
        return distance / averageWalkingSpeed; // time in seconds
    }

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }

    window.calculatePath = function() {
        const currentLocation = document.getElementById('current-location').value;
        const destination = document.getElementById('destination').value;

        try {
            if (currentLocation === destination) {
                throw new Error("Current location and destination cannot be the same.");
            }

            if (locations[currentLocation] && locations[destination]) {
                const start = locations[currentLocation];
                const end = locations[destination];

                // Draw the path
                drawPath(start, end);

                // Calculate distance and time
                const distance = calculateDistance(start, end);
                const timeInSeconds = estimateTime(distance);

                // Convert time to a more readable format (e.g., minutes and seconds)
                const minutes = Math.floor(timeInSeconds / 60);
                const seconds = Math.round(timeInSeconds % 60);

                // Display the results side by side
                document.getElementById('distance').textContent = `Estimated Distance: ${distance.toFixed(2)} meters`;
                document.getElementById('time').textContent = `Estimated Time: ${minutes} minutes ${seconds} seconds`;

                // Voice alert
                const alertText = `The estimated distance is ${distance.toFixed(2)} meters and the estimated time is ${minutes} minutes and ${seconds} seconds.`;
                speak(alertText);
            }
        } catch (error) {
            alert(error.message);
        }
    };
};
