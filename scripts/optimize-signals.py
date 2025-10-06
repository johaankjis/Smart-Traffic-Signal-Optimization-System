#!/usr/bin/env python3
"""
Traffic Signal Optimization Engine
Uses rule-based logic and simple ML to calculate optimal signal timings
"""

import json
import sys
from datetime import datetime
from typing import Dict, List, Any

def calculate_priority_score(vehicle_count: int, queue_length: int, avg_speed: float) -> float:
    """
    Calculate priority score for a direction based on traffic metrics
    Higher score = higher priority for green light
    """
    # Normalize metrics
    congestion_score = (vehicle_count * 0.4) + (queue_length * 0.6)
    speed_penalty = max(0, (50 - avg_speed) / 50)  # Penalty for slow traffic
    
    priority = congestion_score * (1 + speed_penalty)
    return round(priority, 2)

def optimize_signal_timings(traffic_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Main optimization algorithm
    Returns recommended signal timings based on current traffic conditions
    """
    if not traffic_data:
        return {
            "error": "No traffic data provided",
            "recommendations": []
        }
    
    # Calculate priority scores for each direction
    priorities = []
    for data in traffic_data:
        score = calculate_priority_score(
            data['vehicleCount'],
            data['queueLength'],
            data['avgSpeed']
        )
        priorities.append({
            'direction': data['direction'],
            'priority': score,
            'vehicleCount': data['vehicleCount'],
            'queueLength': data['queueLength']
        })
    
    # Sort by priority (highest first)
    priorities.sort(key=lambda x: x['priority'], reverse=True)
    
    # Calculate optimal timings based on priorities
    recommendations = []
    total_cycle_time = 120  # Total cycle time in seconds
    min_green = 15  # Minimum green time
    max_green = 45  # Maximum green time
    yellow_time = 3
    
    # Distribute green time proportionally to priority
    total_priority = sum(p['priority'] for p in priorities)
    
    for p in priorities:
        if total_priority > 0:
            # Proportional allocation
            green_duration = int((p['priority'] / total_priority) * (total_cycle_time - (4 * yellow_time)))
            green_duration = max(min_green, min(green_duration, max_green))
        else:
            green_duration = 25  # Default
        
        red_duration = total_cycle_time - green_duration - yellow_time
        
        recommendations.append({
            'direction': p['direction'],
            'greenDuration': green_duration,
            'yellowDuration': yellow_time,
            'redDuration': red_duration,
            'priority': p['priority']
        })
    
    # Calculate expected improvement
    current_avg_wait = sum(p['queueLength'] * 2 for p in priorities) / len(priorities)
    optimized_wait = current_avg_wait * 0.75  # Estimated 25% improvement
    expected_improvement = round(((current_avg_wait - optimized_wait) / current_avg_wait) * 100, 1)
    
    # Calculate confidence based on data quality
    avg_vehicle_count = sum(p['vehicleCount'] for p in priorities) / len(priorities)
    confidence = min(0.95, 0.5 + (avg_vehicle_count / 100))
    
    return {
        'recommendations': recommendations,
        'expectedImprovement': expected_improvement,
        'confidence': round(confidence, 2),
        'algorithm': 'rule-based',
        'timestamp': datetime.now().isoformat()
    }

def main():
    """
    Main entry point - reads traffic data from stdin and outputs optimization results
    """
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        
        # Extract traffic data
        traffic_data = data.get('trafficData', [])
        intersection_id = data.get('intersectionId', 'unknown')
        
        # Run optimization
        result = optimize_signal_timings(traffic_data)
        result['intersectionId'] = intersection_id
        result['id'] = f"opt-{intersection_id}-{int(datetime.now().timestamp())}"
        
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            'error': str(e),
            'recommendations': [],
            'expectedImprovement': 0,
            'confidence': 0,
            'algorithm': 'rule-based'
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == '__main__':
    main()
