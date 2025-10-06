# 🚦 Smart Traffic Signal Optimization System

A real-time traffic signal optimization system built with Next.js, TypeScript, and Python. This intelligent system uses rule-based algorithms and traffic simulations to optimize signal timings at intersections, reducing congestion and improving traffic flow.

## ✨ Features

### Real-Time Traffic Monitoring
- **Live Traffic Dashboard**: Monitor all intersections in real-time with dynamic updates
- **Traffic Simulation Engine**: Simulates realistic vehicle counts based on time-of-day patterns
- **System-Wide Metrics**: Track total intersections, active signals, average wait times, and congestion levels

### Intelligent Signal Optimization
- **Automated Optimization**: Python-based optimization engine calculates optimal signal timings
- **Rule-Based Algorithm**: Uses priority scoring based on vehicle count, queue length, and average speed
- **Confidence Scoring**: Provides confidence metrics for optimization recommendations
- **Expected Improvement Analysis**: Calculates and displays expected traffic flow improvements

### Traffic Signal Management
- **Individual Signal Control**: View and manage each intersection's traffic signals
- **Bulk Override Panel**: Apply timing changes across multiple signals simultaneously
- **Manual Override Support**: Option to manually control signal timings when needed
- **Signal State Visualization**: Visual representation of current signal states (red, yellow, green)

### Data Visualization
- **Traffic Flow Charts**: Real-time charts showing traffic patterns and trends using Recharts
- **Signal Status Grid**: Grid view of all signal states at an intersection
- **Intersection Cards**: Summary cards with location, signal status, and quick access

### Interactive Controls
- **Simulator Control**: Start/stop traffic simulation with real-time status updates
- **Optimization Actions**: Calculate optimizations or apply them automatically
- **Responsive UI**: Modern, responsive interface built with Tailwind CSS and Radix UI

## 🛠 Technology Stack

### Frontend
- **Framework**: [Next.js 15.2.4](https://nextjs.org/) (React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI primitives with custom components
- **Icons**: Lucide React
- **Data Fetching**: SWR (React Hooks for Data Fetching)
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Optimization Engine**: Python 3
- **Data Storage**: In-memory data store (extendable to databases)

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint (Next.js configuration)
- **Type Checking**: TypeScript strict mode

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Next.js App)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │  Dashboard  │  │ Intersection│  │  Traffic Charts  │   │
│  │    Page     │  │    Detail   │  │  & Visualizations│   │
│  └─────────────┘  └─────────────┘  └──────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ API Calls (SWR)
┌──────────────────────────┴──────────────────────────────────┐
│                   Next.js API Routes                         │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐ │
│  │/api/     │  │/api/     │  │/api/       │  │/api/     │ │
│  │metrics   │  │simulator │  │intersections│ │optimize  │ │
│  └──────────┘  └──────────┘  └────────────┘  └──────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                     Business Logic Layer                     │
│  ┌───────────────┐  ┌──────────────────┐  ┌─────────────┐ │
│  │  Data Store   │  │Traffic Simulator │  │Optimization │ │
│  │  (In-Memory)  │  │     Engine       │  │   Engine    │ │
│  └───────────────┘  └──────────────────┘  └──────┬──────┘ │
└────────────────────────────────────────────────────┼────────┘
                                                     │
                                      ┌──────────────┴─────────┐
                                      │  Python Optimization   │
                                      │  Script (optimize-     │
                                      │  signals.py)           │
                                      └────────────────────────┘
```

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Python 3.x (for optimization engine)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/johaankjis/Smart-Traffic-Signal-Optimization-System.git
   cd Smart-Traffic-Signal-Optimization-System
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Verify Python is installed**
   ```bash
   python3 --version
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
# or
npm run build
npm start
```

## 🚀 Usage

### Starting the System

1. **Launch the Application**: Open the application in your browser
2. **Start Simulator**: The traffic simulator starts automatically, or use the Simulator Control panel to start/stop it manually
3. **Monitor Traffic**: View real-time traffic metrics on the dashboard

### Optimizing an Intersection

1. **Navigate to Intersection**: Click "View Details" on any intersection card
2. **View Current State**: Check current signal timings and traffic flow
3. **Calculate Optimization**: Click "Calculate Optimization" to see recommendations
4. **Review Results**: See expected improvement percentage and confidence score
5. **Apply Optimization**: Click "Optimize & Apply" to implement the recommended timings

### Bulk Signal Management

1. **Open Bulk Override Panel**: Available on intersection detail pages
2. **Select Multiple Signals**: Choose signals to modify
3. **Set Timings**: Configure green, yellow, and red durations
4. **Apply Changes**: Update all selected signals simultaneously

## 📁 Project Structure

```
Smart-Traffic-Signal-Optimization-System/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── intersections/        # Intersection data endpoints
│   │   ├── metrics/              # System metrics endpoints
│   │   ├── optimize/             # Optimization endpoints
│   │   └── simulator/            # Simulator control endpoints
│   ├── intersection/[id]/        # Dynamic intersection detail pages
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Dashboard homepage
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # Reusable UI components (Radix-based)
│   ├── bulk-override-panel.tsx   # Bulk signal control
│   ├── intersection-card.tsx     # Intersection summary card
│   ├── signal-control-dialog.tsx # Individual signal control
│   ├── signal-status-grid.tsx    # Signal state grid view
│   ├── simulator-control.tsx     # Simulator start/stop controls
│   ├── system-metrics.tsx        # System-wide metrics display
│   └── traffic-flow-chart.tsx    # Traffic visualization charts
├── lib/                          # Core business logic
│   ├── data-store.ts             # In-memory data management
│   ├── optimization-engine.ts    # Optimization wrapper
│   ├── traffic-simulator.ts      # Traffic simulation engine
│   ├── types.ts                  # TypeScript type definitions
│   └── utils.ts                  # Utility functions
├── scripts/                      # Python scripts
│   └── optimize-signals.py       # Traffic signal optimization algorithm
├── public/                       # Static assets
├── styles/                       # Additional styles
├── package.json                  # Node.js dependencies
├── tsconfig.json                 # TypeScript configuration
├── next.config.mjs               # Next.js configuration
└── tailwind.config.ts            # Tailwind CSS configuration
```

## 🔌 API Documentation

### GET /api/intersections
Returns all intersections with their current signal states.

**Response:**
```json
{
  "intersections": [
    {
      "id": "int-001",
      "name": "Main St & 1st Ave",
      "location": {
        "latitude": 40.7128,
        "longitude": -74.006
      },
      "signals": [...],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /api/metrics
Returns system-wide traffic metrics.

**Response:**
```json
{
  "metrics": {
    "totalIntersections": 4,
    "activeSignals": 16,
    "avgWaitTime": 45,
    "congestionLevel": "medium",
    "optimizationRate": 0.85,
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/simulator
Controls the traffic simulator.

**Request:**
```json
{
  "action": "start" | "stop"
}
```

**Response:**
```json
{
  "status": "started",
  "isRunning": true,
  "simulationSpeed": 2000
}
```

### GET /api/simulator
Gets current simulator status.

**Response:**
```json
{
  "isRunning": true,
  "simulationSpeed": 2000
}
```

### POST /api/optimize/[id]
Optimizes signal timings for a specific intersection.

**Request:**
```json
{
  "autoApply": true | false
}
```

**Response:**
```json
{
  "id": "opt-int-001-1234567890",
  "intersectionId": "int-001",
  "timestamp": "2024-01-01T00:00:00Z",
  "recommendations": [
    {
      "direction": "north",
      "greenDuration": 35,
      "yellowDuration": 3,
      "redDuration": 82,
      "priority": 45.2
    }
  ],
  "expectedImprovement": 25.5,
  "confidence": 0.87,
  "algorithm": "rule-based"
}
```

## 🎯 Core Algorithms

### Traffic Simulation
The system simulates realistic traffic patterns based on:
- **Time of Day**: Higher traffic during rush hours (7-9 AM, 5-7 PM)
- **Random Variance**: ±20% variation to simulate realistic conditions
- **Signal State Impact**: Queue length increases when signals are red
- **Speed Calculation**: Average speed decreases with congestion

### Optimization Algorithm
The Python optimization engine uses a priority-based approach:

1. **Priority Score Calculation**:
   ```
   priority = (vehicleCount × 0.4 + queueLength × 0.6) × (1 + speedPenalty)
   ```

2. **Green Time Distribution**:
   - Proportional to priority scores
   - Constrained between min (15s) and max (45s) durations
   - Total cycle time: 120 seconds

3. **Expected Improvement**:
   - Estimated 25% reduction in average wait time
   - Based on queue length reduction

## 🎨 UI Components

The system includes a comprehensive set of custom UI components built on Radix UI:

- **Cards**: Intersection and metric display containers
- **Buttons**: Primary actions and controls
- **Badges**: Status indicators
- **Dialogs**: Modal interactions
- **Charts**: Traffic flow visualization (Recharts)
- **Tabs**: Content organization
- **Sliders**: Timing adjustments
- **Toggle Groups**: Option selection

## 🔧 Configuration

### Environment Variables
No environment variables are required for basic operation. The system uses in-memory storage.

### Customization Options

**Traffic Simulator** (`lib/traffic-simulator.ts`):
- `simulationSpeed`: Update interval (default: 2000ms)
- `getBaseTrafficForTime()`: Adjust traffic patterns

**Optimization Engine** (`scripts/optimize-signals.py`):
- `min_green`: Minimum green duration (default: 15s)
- `max_green`: Maximum green duration (default: 45s)
- `total_cycle_time`: Total signal cycle (default: 120s)

**Data Store** (`lib/data-store.ts`):
- Add/modify initial intersections
- Adjust data retention limits

## 📊 Performance Considerations

- **SWR Data Fetching**: Automatic caching and revalidation
- **Refresh Intervals**: 
  - System metrics: 3000ms
  - Simulator status: 2000ms
  - Traffic data: Generated every 2000ms
- **Data Limits**: 
  - Traffic data: 1000 records per intersection
  - Optimization results: 100 results per intersection

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code style (use ESLint)
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Known Issues & Future Enhancements

### Current Limitations
- In-memory storage (data lost on restart)
- Single Python process execution (no parallel optimizations)
- No user authentication or multi-tenancy
- Limited to rule-based optimization (ML features planned)

### Planned Features
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Machine learning-based optimization
- [ ] Historical data analysis and reporting
- [ ] Multi-user support with authentication
- [ ] Mobile app for traffic monitoring
- [ ] Integration with real traffic sensors/APIs
- [ ] Predictive traffic modeling
- [ ] Geographic map view of intersections
- [ ] Email/SMS alerts for high congestion
- [ ] A/B testing for optimization strategies

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

Created and maintained by the Smart Traffic Systems team.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components powered by [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team

---

**Note**: This is a demonstration/educational project. For production traffic systems, additional safety measures, redundancy, and real-world testing would be required.
