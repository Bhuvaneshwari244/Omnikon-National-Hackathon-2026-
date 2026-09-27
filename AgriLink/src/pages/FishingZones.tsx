import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Fish, 
  Waves, 
  MapPin, 
  ThermometerSun,
  Wind,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Navigation
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { StaggerContainer, StaggerItem } from '@/components/StaggerChildren';

interface FishingZone {
  id: string;
  name: string;
  location: string;
  coordinates: string;
  waterBody: string;
  productivity: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  fishDensity: string;
  commonSpecies: string[];
  waterTemp: number;
  phLevel: number;
  depth: string;
  currentWeather: string;
  safetyRating: 'Safe' | 'Moderate' | 'Risky';
  bestTime: string;
  facilities: string[];
  distance: number;
  lastUpdated: string;
}

const FishingZones = () => {
  const [activeTab, setActiveTab] = useState<'zones' | 'conditions' | 'forecast' | 'safety'>('zones');
  const [selectedWaterBody, setSelectedWaterBody] = useState<string>('all');
  const [selectedProductivity, setSelectedProductivity] = useState<string>('all');

  const [zones] = useState<FishingZone[]>([
    {
      id: 'FZ-001',
      name: 'Krishna River Delta',
      location: 'Vijayawada, Andhra Pradesh',
      coordinates: '16.5062° N, 80.6480° E',
      waterBody: 'River',
      productivity: 'Excellent',
      fishDensity: 'High (15-20 fish/sq.m)',
      commonSpecies: ['Rohu', 'Catla', 'Mrigal', 'Prawns'],
      waterTemp: 28,
      phLevel: 7.2,
      depth: '5-12 meters',
      currentWeather: 'Clear, Light winds',
      safetyRating: 'Safe',
      bestTime: 'Early morning (5-8 AM), Evening (5-7 PM)',
      facilities: ['Boat ramp', 'Ice plant', 'Fish market', 'Fuel station'],
      distance: 5,
      lastUpdated: '2026-08-15 06:00'
    },
    {
      id: 'FZ-002',
      name: 'Pulicat Lake - North',
      location: 'Nellore, Andhra Pradesh',
      coordinates: '13.6553° N, 80.3170° E',
      waterBody: 'Lagoon',
      productivity: 'Good',
      fishDensity: 'Moderate (10-15 fish/sq.m)',
      commonSpecies: ['Mullet', 'Shrimp', 'Crab', 'Sea Bass'],
      waterTemp: 29,
      phLevel: 7.8,
      depth: '2-6 meters',
      currentWeather: 'Partly cloudy, Moderate breeze',
      safetyRating: 'Safe',
      bestTime: 'Full day (6 AM - 6 PM)',
      facilities: ['Landing center', 'Ice facility', 'Auction hall'],
      distance: 45,
      lastUpdated: '2026-08-15 05:30'
    },
    {
      id: 'FZ-003',
      name: 'Godavari Estuary',
      location: 'East Godavari, Andhra Pradesh',
      coordinates: '16.9902° N, 82.2473° E',
      waterBody: 'Estuary',
      productivity: 'Excellent',
      fishDensity: 'Very High (20-25 fish/sq.m)',
      commonSpecies: ['Hilsa', 'Barramundi', 'Prawns', 'Crabs'],
      waterTemp: 27,
      phLevel: 7.5,
      depth: '3-10 meters',
      currentWeather: 'Clear, Calm waters',
      safetyRating: 'Safe',
      bestTime: 'Morning (4-9 AM)',
      facilities: ['Harbor', 'Cold storage', 'Processing plant', 'Fuel'],
      distance: 78,
      lastUpdated: '2026-08-15 06:15'
    },
    {
      id: 'FZ-004',
      name: 'Visakhapatnam Coast - Zone A',
      location: 'Visakhapatnam, Andhra Pradesh',
      coordinates: '17.6868° N, 83.2185° E',
      waterBody: 'Sea (Bay of Bengal)',
      productivity: 'Good',
      fishDensity: 'Moderate (8-12 fish/sq.m)',
      commonSpecies: ['Mackerel', 'Sardines', 'Pomfret', 'Tuna'],
      waterTemp: 30,
      phLevel: 8.1,
      depth: '10-30 meters',
      currentWeather: 'Cloudy, Strong breeze',
      safetyRating: 'Moderate',
      bestTime: 'Early morning (4-7 AM)',
      facilities: ['Harbor', 'Fish market', 'Ice plant', 'Fuel', 'Repair dock'],
      distance: 125,
      lastUpdated: '2026-08-15 04:45'
    },
    {
      id: 'FZ-005',
      name: 'Kolleru Lake',
      location: 'West Godavari, Andhra Pradesh',
      coordinates: '16.7000° N, 81.2833° E',
      waterBody: 'Freshwater Lake',
      productivity: 'Fair',
      fishDensity: 'Low-Moderate (5-8 fish/sq.m)',
      commonSpecies: ['Catfish', 'Snakehead', 'Tilapia', 'Carp'],
      waterTemp: 26,
      phLevel: 7.0,
      depth: '1-3 meters',
      currentWeather: 'Clear, Calm',
      safetyRating: 'Safe',
      bestTime: 'Evening (4-7 PM)',
      facilities: ['Small landing', 'Local market'],
      distance: 32,
      lastUpdated: '2026-08-15 05:00'
    }
  ]);

  const getProductivityColor = (productivity: string) => {
    switch (productivity) {
      case 'Excellent': return 'bg-green-500';
      case 'Good': return 'bg-blue-500';
      case 'Fair': return 'bg-yellow-500';
      case 'Poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSafetyColor = (safety: string) => {
    switch (safety) {
      case 'Safe': return 'text-green-600 bg-green-50';
      case 'Moderate': return 'text-yellow-600 bg-yellow-50';
      case 'Risky': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredZones = zones.filter(zone => {
    const matchesWaterBody = selectedWaterBody === 'all' || zone.waterBody === selectedWaterBody;
    const matchesProductivity = selectedProductivity === 'all' || zone.productivity === selectedProductivity;
    return matchesWaterBody && matchesProductivity;
  });


  return (
      <PageTransition>
        
        
        <div className="min-h-screen py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center mb-4">
                <Fish className="h-16 w-16 text-blue-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Productive Fishing Zones
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Identify safe, high-yield fishing areas with real-time water conditions, 
                fish density data, and safety ratings.
              </p>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button
                variant={activeTab === 'zones' ? 'default' : 'outline'}
                onClick={() => setActiveTab('zones')}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Fishing Zones ({zones.length})
              </Button>
              <Button
                variant={activeTab === 'conditions' ? 'default' : 'outline'}
                onClick={() => setActiveTab('conditions')}
              >
                <Waves className="mr-2 h-4 w-4" />
                Water Conditions
              </Button>
              <Button
                variant={activeTab === 'forecast' ? 'default' : 'outline'}
                onClick={() => setActiveTab('forecast')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                7-Day Forecast
              </Button>
              <Button
                variant={activeTab === 'safety' ? 'default' : 'outline'}
                onClick={() => setActiveTab('safety')}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Safety Alerts
              </Button>
            </div>

            {/* Zones Tab */}
            {activeTab === 'zones' && (
              <StaggerChildren>
                
                {/* Filters */}
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Water Body Type</Label>
                        <Select value={selectedWaterBody} onValueChange={setSelectedWaterBody}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="River">River</SelectItem>
                            <SelectItem value="Lagoon">Lagoon</SelectItem>
                            <SelectItem value="Estuary">Estuary</SelectItem>
                            <SelectItem value="Sea (Bay of Bengal)">Sea</SelectItem>
                            <SelectItem value="Freshwater Lake">Lake</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Productivity Level</Label>
                        <Select value={selectedProductivity} onValueChange={setSelectedProductivity}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Zones Grid */}
                <div className="grid grid-cols-1 gap-6">
                  {filteredZones.map((zone, index) => (
                    <motion.div
                      key={zone.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-2xl">{zone.name}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <MapPin className="h-4 w-4" />
                                {zone.location}
                              </CardDescription>
                              <div className="text-sm text-gray-500 mt-1">{zone.coordinates}</div>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                              <Badge className={getProductivityColor(zone.productivity)}>
                                {zone.productivity}
                              </Badge>
                              <Badge variant="outline">{zone.waterBody}</Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          
                          {/* Key Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-center">
                              <ThermometerSun className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                              <div className="text-sm text-gray-600">Water Temp</div>
                              <div className="text-lg font-bold text-blue-600">{zone.waterTemp}°C</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg text-center">
                              <Waves className="h-5 w-5 mx-auto text-green-600 mb-1" />
                              <div className="text-sm text-gray-600">pH Level</div>
                              <div className="text-lg font-bold text-green-600">{zone.phLevel}</div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg text-center">
                              <Fish className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                              <div className="text-sm text-gray-600">Depth</div>
                              <div className="text-sm font-bold text-purple-600">{zone.depth}</div>
                            </div>
                            <div className="bg-orange-50 p-3 rounded-lg text-center">
                              <Navigation className="h-5 w-5 mx-auto text-orange-600 mb-1" />
                              <div className="text-sm text-gray-600">Distance</div>
                              <div className="text-lg font-bold text-orange-600">{zone.distance} km</div>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          {/* Fish Density */}
                          <div className="mb-4">
                            <Label className="text-sm text-gray-600">Fish Density:</Label>
                            <div className="text-lg font-semibold text-green-600 mt-1">
                              {zone.fishDensity}
                            </div>
                          </div>

                          {/* Common Species */}
                          <div className="mb-4">
                            <Label className="text-sm text-gray-600">Common Species:</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {zone.commonSpecies.map((species, i) => (
                                <Badge key={i} variant="secondary">
                                  🐟 {species}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <Separator className="my-4" />

                          {/* Current Conditions */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-2 text-sm mb-2">
                                <Wind className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">Weather:</span>
                                <span className="font-semibold">{zone.currentWeather}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm mb-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">Best Time:</span>
                                <span className="font-semibold">{zone.bestTime}</span>
                              </div>
                            </div>
                            <div>
                              <div className={`p-3 rounded-lg ${getSafetyColor(zone.safetyRating)}`}>
                                <div className="flex items-center gap-2">
                                  {zone.safetyRating === 'Safe' ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                  ) : (
                                    <AlertTriangle className="h-5 w-5" />
                                  )}
                                  <div>
                                    <div className="text-sm font-semibold">Safety Rating</div>
                                    <div className="text-lg font-bold">{zone.safetyRating}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Facilities */}
                          <div className="mb-4">
                            <Label className="text-sm text-gray-600">Available Facilities:</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {zone.facilities.map((facility, i) => (
                                <Badge key={i} variant="outline" className="bg-gray-50">
                                  ✓ {facility}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="text-xs text-gray-500 mb-4">
                            Last updated: {zone.lastUpdated}
                          </div>

                          <Separator className="my-4" />

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button className="flex-1">
                              <Navigation className="mr-2 h-4 w-4" />
                              Get Directions
                            </Button>
                            <Button variant="outline" className="flex-1">
                              View Full Report
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

              </StaggerChildren>
            )}

            {/* Water Conditions Tab */}
            {activeTab === 'conditions' && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Water Conditions</CardTitle>
                  <CardDescription>Real-time environmental parameters across all zones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {zones.map((zone) => (
                      <div key={zone.id} className="border rounded-lg p-4">
                        <div className="font-semibold text-lg mb-3">{zone.name}</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-sm text-gray-600">Temperature</div>
                            <div className="text-xl font-bold text-blue-600">{zone.waterTemp}°C</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">pH Level</div>
                            <div className="text-xl font-bold text-green-600">{zone.phLevel}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Depth</div>
                            <div className="text-lg font-bold text-purple-600">{zone.depth}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">Weather</div>
                            <div className="text-sm font-semibold">{zone.currentWeather}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Forecast Tab */}
            {activeTab === 'forecast' && (
              <Card>
                <CardHeader>
                  <CardTitle>7-Day Fishing Forecast</CardTitle>
                  <CardDescription>Best fishing days and conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                      <div key={day} className="flex items-center justify-between border rounded-lg p-4">
                        <div>
                          <div className="font-semibold">{day}</div>
                          <div className="text-sm text-gray-600">Aug {16+i}, 2026</div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-sm text-gray-600">Weather</div>
                            <div className="font-semibold">
                              {i % 2 === 0 ? 'Sunny ☀️' : 'Cloudy ☁️'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600">Fishing Condition</div>
                            <Badge className={i % 3 === 0 ? 'bg-green-500' : 'bg-blue-500'}>
                              {i % 3 === 0 ? 'Excellent' : 'Good'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Safety Alerts Tab */}
            {activeTab === 'safety' && (
              <Card>
                <CardHeader>
                  <CardTitle>Safety Alerts & Advisories</CardTitle>
                  <CardDescription>Current warnings and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-semibold text-green-800">All Clear</div>
                          <div className="text-sm text-green-700 mt-1">
                            No active weather warnings or safety concerns for coastal and inland fishing zones.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="font-semibold text-blue-800 mb-2">General Safety Guidelines</div>
                      <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                        <li>Always check weather forecast before heading out</li>
                        <li>Carry life jackets and safety equipment</li>
                        <li>Inform someone about your fishing location and expected return time</li>
                        <li>Respect fishing regulations and protected species</li>
                        <li>Monitor tide times for coastal and estuary fishing</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </PageTransition>
      );
};

export default FishingZones;


