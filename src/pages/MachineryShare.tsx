import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Tractor, 
  MapPin, 
  Calendar,
  Clock,
  IndianRupee,
  Star,
  Phone,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  TrendingUp
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { StaggerContainer, StaggerItem } from '@/components/StaggerChildren';

interface MachineryListing {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerRating: number;
  machineryType: string;
  brand: string;
  model: string;
  year: number;
  condition: 'Excellent' | 'Good' | 'Fair';
  location: string;
  district: string;
  state: string;
  dailyRate: number;
  weeklyRate: number;
  availability: 'Available' | 'Booked' | 'Maintenance';
  nextAvailable: string;
  features: string[];
  operatorIncluded: boolean;
  fuelIncluded: boolean;
  minBookingHours: number;
  deliveryAvailable: boolean;
  deliveryRadius: number;
  distance: number;
  imageUrl: string;
  totalBookings: number;
  rating: number;
}

const MachineryShare = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'myListings' | 'bookings' | 'addEquipment'>('browse');
  const [selectedMachinery, setSelectedMachinery] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [listings] = useState<MachineryListing[]>([
    {
      id: 'MAC-001',
      ownerId: 'OWN-1234',
      ownerName: 'Rajesh Patil',
      ownerPhone: '+91 98765 43210',
      ownerRating: 4.8,
      machineryType: 'Tractor',
      brand: 'Mahindra',
      model: '575 DI',
      year: 2022,
      condition: 'Excellent',
      location: 'Anantapur, Andhra Pradesh',
      district: 'Anantapur',
      state: 'Andhra Pradesh',
      dailyRate: 1500,
      weeklyRate: 9000,
      availability: 'Available',
      nextAvailable: '2026-08-16',
      features: ['Power steering', 'Good tires', 'Recently serviced', 'Oil-immersed brakes'],
      operatorIncluded: true,
      fuelIncluded: false,
      minBookingHours: 4,
      deliveryAvailable: true,
      deliveryRadius: 20,
      distance: 8,
      imageUrl: '/placeholder.svg',
      totalBookings: 45,
      rating: 4.7
    },
    {
      id: 'MAC-002',
      ownerId: 'OWN-2345',
      ownerName: 'Suresh Kumar',
      ownerPhone: '+91 98765 43211',
      ownerRating: 4.9,
      machineryType: 'Combine Harvester',
      brand: 'Kartar',
      model: '4000',
      year: 2021,
      condition: 'Good',
      location: 'Guntur, Andhra Pradesh',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      dailyRate: 5000,
      weeklyRate: 30000,
      availability: 'Available',
      nextAvailable: '2026-08-17',
      features: ['Adjustable header', 'High capacity', 'GPS guided', 'Grain tank 1500L'],
      operatorIncluded: true,
      fuelIncluded: true,
      minBookingHours: 8,
      deliveryAvailable: true,
      deliveryRadius: 50,
      distance: 25,
      imageUrl: '/placeholder.svg',
      totalBookings: 32,
      rating: 4.9
    },
    {
      id: 'MAC-003',
      ownerId: 'OWN-3456',
      ownerName: 'Lakshman Reddy',
      ownerPhone: '+91 98765 43212',
      ownerRating: 4.6,
      machineryType: 'Rotavator',
      brand: 'Fieldking',
      model: 'FKR-180',
      year: 2023,
      condition: 'Excellent',
      location: 'Vijayawada, Andhra Pradesh',
      district: 'Krishna',
      state: 'Andhra Pradesh',
      dailyRate: 800,
      weeklyRate: 4500,
      availability: 'Booked',
      nextAvailable: '2026-08-20',
      features: ['Heavy duty', 'Multiple blade options', 'Soil pulverizing', 'Side drive'],
      operatorIncluded: false,
      fuelIncluded: false,
      minBookingHours: 3,
      deliveryAvailable: true,
      deliveryRadius: 15,
      distance: 12,
      imageUrl: '/placeholder.svg',
      totalBookings: 67,
      rating: 4.5
    },
    {
      id: 'MAC-004',
      ownerId: 'OWN-4567',
      ownerName: 'Anjali Devi',
      ownerPhone: '+91 98765 43213',
      ownerRating: 4.7,
      machineryType: 'Seed Drill',
      brand: 'Happy Seeder',
      model: 'HS-9',
      year: 2022,
      condition: 'Good',
      location: 'Chittoor, Andhra Pradesh',
      district: 'Chittoor',
      state: 'Andhra Pradesh',
      dailyRate: 600,
      weeklyRate: 3500,
      availability: 'Available',
      nextAvailable: '2026-08-16',
      features: ['9-row planting', 'Adjustable spacing', 'Seed metering', 'Fertilizer box'],
      operatorIncluded: false,
      fuelIncluded: false,
      minBookingHours: 4,
      deliveryAvailable: false,
      deliveryRadius: 0,
      distance: 45,
      imageUrl: '/placeholder.svg',
      totalBookings: 28,
      rating: 4.6
    },
    {
      id: 'MAC-005',
      ownerId: 'OWN-5678',
      ownerName: 'Venkat Rao',
      ownerPhone: '+91 98765 43214',
      ownerRating: 4.9,
      machineryType: 'Sprayer',
      brand: 'Aspee',
      model: 'Shakti Power',
      year: 2023,
      condition: 'Excellent',
      location: 'Anantapur, Andhra Pradesh',
      district: 'Anantapur',
      state: 'Andhra Pradesh',
      dailyRate: 400,
      weeklyRate: 2200,
      availability: 'Available',
      nextAvailable: '2026-08-16',
      features: ['400L tank', 'Boom sprayer', 'Adjustable nozzles', 'Battery powered'],
      operatorIncluded: true,
      fuelIncluded: true,
      minBookingHours: 2,
      deliveryAvailable: true,
      deliveryRadius: 25,
      distance: 5,
      imageUrl: '/placeholder.svg',
      totalBookings: 89,
      rating: 4.8
    }
  ]);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'bg-green-500';
      case 'Good': return 'bg-blue-500';
      case 'Fair': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'text-green-600 bg-green-50';
      case 'Booked': return 'text-red-600 bg-red-50';
      case 'Maintenance': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesMachinery = selectedMachinery === 'all' || listing.machineryType === selectedMachinery;
    const matchesAvailability = selectedAvailability === 'all' || listing.availability === selectedAvailability;
    const matchesSearch = searchQuery === '' || 
      listing.machineryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesMachinery && matchesAvailability && matchesSearch;
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
                <Tractor className="h-16 w-16 text-orange-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Agricultural Machinery Sharing
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Rent or share farm equipment with nearby farmers. 
                Reduce costs, increase efficiency, and maximize equipment utilization.
              </p>
              
              {/* Impact Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-orange-600">350+</div>
                    <div className="text-sm text-gray-600">Equipment Listed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-green-600">₹25L+</div>
                    <div className="text-sm text-gray-600">Monthly Savings</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-blue-600">1,200+</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-purple-600">4.7⭐</div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button
                variant={activeTab === 'browse' ? 'default' : 'outline'}
                onClick={() => setActiveTab('browse')}
              >
                <Search className="mr-2 h-4 w-4" />
                Browse Equipment ({listings.length})
              </Button>
              <Button
                variant={activeTab === 'myListings' ? 'default' : 'outline'}
                onClick={() => setActiveTab('myListings')}
              >
                My Listings
              </Button>
              <Button
                variant={activeTab === 'bookings' ? 'default' : 'outline'}
                onClick={() => setActiveTab('bookings')}
              >
                My Bookings
              </Button>
              <Button
                variant={activeTab === 'addEquipment' ? 'default' : 'outline'}
                onClick={() => setActiveTab('addEquipment')}
              >
                <Plus className="mr-2 h-4 w-4" />
                List Equipment
              </Button>
            </div>

            {/* Browse Equipment Tab */}
            {activeTab === 'browse' && (
              <StaggerChildren>
                
                {/* Filters */}
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Search</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Equipment type, brand, location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Equipment Type</Label>
                        <Select value={selectedMachinery} onValueChange={setSelectedMachinery}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Equipment</SelectItem>
                            <SelectItem value="Tractor">Tractor</SelectItem>
                            <SelectItem value="Combine Harvester">Combine Harvester</SelectItem>
                            <SelectItem value="Rotavator">Rotavator</SelectItem>
                            <SelectItem value="Seed Drill">Seed Drill</SelectItem>
                            <SelectItem value="Sprayer">Sprayer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Availability</Label>
                        <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Available">Available Now</SelectItem>
                            <SelectItem value="Booked">Booked</SelectItem>
                            <SelectItem value="Maintenance">Under Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Equipment Listings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredListings.map((listing, index) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl">
                                {listing.brand} {listing.model}
                              </CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Tractor className="h-4 w-4" />
                                {listing.machineryType} • {listing.year}
                              </CardDescription>
                              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                <MapPin className="h-3 w-3" />
                                {listing.location} • {listing.distance} km away
                              </div>
                            </div>
                            <Badge className={getConditionColor(listing.condition)}>
                              {listing.condition}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          
                          {/* Pricing */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-orange-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-600">Daily Rate</div>
                              <div className="text-2xl font-bold text-orange-600 flex items-center">
                                <IndianRupee className="h-5 w-5" />
                                {listing.dailyRate}
                              </div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-600">Weekly Rate</div>
                              <div className="text-2xl font-bold text-green-600 flex items-center">
                                <IndianRupee className="h-5 w-5" />
                                {listing.weeklyRate}
                              </div>
                            </div>
                          </div>

                          {/* Availability Status */}
                          <div className={`p-3 rounded-lg mb-4 ${getAvailabilityColor(listing.availability)}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold">{listing.availability}</div>
                                {listing.availability !== 'Available' && (
                                  <div className="text-sm mt-1">Next available: {listing.nextAvailable}</div>
                                )}
                              </div>
                              {listing.availability === 'Available' && (
                                <CheckCircle2 className="h-5 w-5" />
                              )}
                            </div>
                          </div>

                          {/* Features */}
                          <div className="mb-4">
                            <Label className="text-sm text-gray-600">Features:</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {listing.features.slice(0, 3).map((feature, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <Separator className="my-4" />

                          {/* Service Details */}
                          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                            <div className="flex items-center gap-2">
                              {listing.operatorIncluded ? '✓' : '✗'}
                              <span className={listing.operatorIncluded ? 'text-green-600' : 'text-gray-600'}>
                                Operator included
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {listing.fuelIncluded ? '✓' : '✗'}
                              <span className={listing.fuelIncluded ? 'text-green-600' : 'text-gray-600'}>
                                Fuel included
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {listing.deliveryAvailable ? '✓' : '✗'}
                              <span className={listing.deliveryAvailable ? 'text-green-600' : 'text-gray-600'}>
                                Delivery ({listing.deliveryRadius} km)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="h-3 w-3" />
                              Min {listing.minBookingHours}h booking
                            </div>
                          </div>

                          {/* Owner & Rating */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="text-sm text-gray-600">Owner</div>
                              <div className="font-semibold">{listing.ownerName}</div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                {listing.ownerRating} ({listing.totalBookings} bookings)
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                <span className="font-bold">{listing.rating}</span>
                              </div>
                              <div className="text-xs text-gray-600">Equipment Rating</div>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1" 
                              disabled={listing.availability !== 'Available'}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {listing.availability === 'Available' ? 'Book Now' : 'Unavailable'}
                            </Button>
                            <Button variant="outline">
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {filteredListings.length === 0 && (
                  <Card>
                    <CardContent className="pt-6 text-center text-gray-500">
                      No equipment found matching your filters.
                    </CardContent>
                  </Card>
                )}
              </StaggerChildren>
            )}

            {/* My Listings Tab */}
            {activeTab === 'myListings' && (
              <Card>
                <CardHeader>
                  <CardTitle>My Equipment Listings</CardTitle>
                  <CardDescription>Manage your shared machinery</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-gray-500 py-8">
                    No equipment listed yet. Click "List Equipment" to add your machinery.
                  </div>
                </CardContent>
              </Card>
            )}

            {/* My Bookings Tab */}
            {activeTab === 'bookings' && (
              <Card>
                <CardHeader>
                  <CardTitle>My Bookings</CardTitle>
                  <CardDescription>View and manage your equipment rentals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-gray-500 py-8">
                    No active bookings. Browse equipment to make a reservation.
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add Equipment Tab */}
            {activeTab === 'addEquipment' && (
              <Card>
                <CardHeader>
                  <CardTitle>List Your Equipment</CardTitle>
                  <CardDescription>
                    Share your agricultural machinery and earn extra income
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Equipment Type *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tractor">Tractor</SelectItem>
                            <SelectItem value="harvester">Combine Harvester</SelectItem>
                            <SelectItem value="rotavator">Rotavator</SelectItem>
                            <SelectItem value="seeddrill">Seed Drill</SelectItem>
                            <SelectItem value="sprayer">Sprayer</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Brand *</Label>
                        <Input placeholder="e.g., Mahindra, John Deere" />
                      </div>

                      <div>
                        <Label>Model *</Label>
                        <Input placeholder="e.g., 575 DI" />
                      </div>

                      <div>
                        <Label>Year of Manufacture *</Label>
                        <Input type="number" placeholder="2022" />
                      </div>

                      <div>
                        <Label>Condition *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Location *</Label>
                        <Input placeholder="Village, District, State" />
                      </div>

                      <div>
                        <Label>Daily Rate (₹) *</Label>
                        <Input type="number" placeholder="1500" />
                      </div>

                      <div>
                        <Label>Weekly Rate (₹) *</Label>
                        <Input type="number" placeholder="9000" />
                      </div>

                      <div>
                        <Label>Minimum Booking Hours *</Label>
                        <Input type="number" placeholder="4" />
                      </div>

                      <div>
                        <Label>Contact Number *</Label>
                        <Input placeholder="+91 98765 43210" />
                      </div>

                      <div className="md:col-span-2">
                        <Label>Features & Specifications</Label>
                        <Textarea 
                          placeholder="List key features (one per line): Power steering, Good tires, Recently serviced..."
                          rows={4}
                        />
                      </div>

                      <div className="md:col-span-2 space-y-3">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="operator" className="rounded" />
                          <Label htmlFor="operator" className="font-normal">
                            Operator included in rate
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="fuel" className="rounded" />
                          <Label htmlFor="fuel" className="font-normal">
                            Fuel included in rate
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="delivery" className="rounded" />
                          <Label htmlFor="delivery" className="font-normal">
                            Delivery available (specify radius in km below)
                          </Label>
                        </div>
                      </div>

                      <div>
                        <Label>Delivery Radius (km)</Label>
                        <Input type="number" placeholder="20" />
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      <Plus className="mr-2 h-5 w-5" />
                      List Equipment
                    </Button>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Earning Potential
                      </h4>
                      <p className="text-sm text-green-700">
                        Earn ₹15,000-40,000 per month by sharing your idle farm equipment. 
                        Zero commission for first 3 months!
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </PageTransition>
      );
};

export default MachineryShare;


