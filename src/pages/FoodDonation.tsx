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
  HeartHandshake, 
  MapPin, 
  Phone, 
  Calendar,
  Package,
  Truck,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Plus,
  Share2
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { StaggerContainer, StaggerItem } from '@/components/StaggerChildren';

interface DonationListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  location: string;
  district: string;
  state: string;
  produce: string;
  quantity: number;
  unit: string;
  quality: 'Excellent' | 'Good' | 'Fair';
  availableFrom: string;
  expiryDays: number;
  description: string;
  imageUrl: string;
  status: 'Available' | 'Reserved' | 'Picked' | 'Delivered';
  transportAvailable: boolean;
  pickupContact: string;
  distance?: number;
  createdAt: string;
}

interface NGORequest {
  id: string;
  ngoName: string;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  beneficiaries: number;
  requiredProduce: string[];
  quantityNeeded: number;
  servingArea: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Active' | 'Fulfilled' | 'Cancelled';
}

const FoodDonation = () => {
  const [activeTab, setActiveTab] = useState<'donate' | 'request' | 'listings' | 'ngos'>('listings');
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock donation listings
  const [listings] = useState<DonationListing[]>([
    {
      id: 'DON-001',
      farmerId: 'FR-1234',
      farmerName: 'Ramesh Kumar',
      farmerPhone: '+91 98765 43210',
      location: 'Anantapur, Andhra Pradesh',
      district: 'Anantapur',
      state: 'Andhra Pradesh',
      produce: 'Tomatoes',
      quantity: 500,
      unit: 'kg',
      quality: 'Good',
      availableFrom: '2026-08-15',
      expiryDays: 5,
      description: 'Fresh tomatoes surplus from harvest. Slightly oversized, perfect for cooking. Can be used for making paste, sauce, or community meals.',
      imageUrl: '/placeholder.svg',
      status: 'Available',
      transportAvailable: true,
      pickupContact: 'Available for pickup or delivery within 30km',
      distance: 12,
      createdAt: '2026-08-14T10:00:00Z'
    },
    {
      id: 'DON-002',
      farmerId: 'FR-2345',
      farmerName: 'Lakshmi Devi',
      farmerPhone: '+91 98765 43211',
      location: 'Guntur, Andhra Pradesh',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      produce: 'Rice',
      quantity: 200,
      unit: 'kg',
      quality: 'Excellent',
      availableFrom: '2026-08-16',
      expiryDays: 90,
      description: 'Premium quality rice surplus. Well-stored, no weevils. Suitable for immediate distribution or storage.',
      imageUrl: '/placeholder.svg',
      status: 'Available',
      transportAvailable: true,
      pickupContact: 'Pickup only, farm location accessible by truck',
      distance: 25,
      createdAt: '2026-08-13T14:30:00Z'
    },
    {
      id: 'DON-003',
      farmerId: 'FR-3456',
      farmerName: 'Suresh Reddy',
      farmerPhone: '+91 98765 43212',
      location: 'Chittoor, Andhra Pradesh',
      district: 'Chittoor',
      state: 'Andhra Pradesh',
      produce: 'Potatoes',
      quantity: 300,
      unit: 'kg',
      quality: 'Fair',
      availableFrom: '2026-08-15',
      expiryDays: 15,
      description: 'Market surplus potatoes. Some slight blemishes but perfectly edible. Great for large-scale cooking.',
      imageUrl: '/placeholder.svg',
      status: 'Reserved',
      transportAvailable: false,
      pickupContact: 'Pickup only, contact for directions',
      distance: 45,
      createdAt: '2026-08-14T09:15:00Z'
    },
    {
      id: 'DON-004',
      farmerId: 'FR-4567',
      farmerName: 'Anjali Patel',
      farmerPhone: '+91 98765 43213',
      location: 'Vijayawada, Andhra Pradesh',
      district: 'Krishna',
      state: 'Andhra Pradesh',
      produce: 'Bananas',
      quantity: 150,
      unit: 'dozens',
      quality: 'Good',
      availableFrom: '2026-08-17',
      expiryDays: 3,
      description: 'Ripe bananas, perfect eating condition. Must be picked up within 3 days. Ideal for immediate distribution.',
      imageUrl: '/placeholder.svg',
      status: 'Available',
      transportAvailable: true,
      pickupContact: 'Urgent pickup needed, delivery available locally',
      distance: 8,
      createdAt: '2026-08-14T16:45:00Z'
    }
  ]);

  // Mock NGO requests
  const [ngoRequests] = useState<NGORequest[]>([
    {
      id: 'NGO-001',
      ngoName: 'Akshaya Patra Foundation',
      contactPerson: 'Mr. Raghavan',
      phone: '+91 98765 00001',
      email: 'raghavan@akshayapatra.org',
      location: 'Vijayawada, Krishna',
      beneficiaries: 5000,
      requiredProduce: ['Rice', 'Dal', 'Vegetables'],
      quantityNeeded: 1000,
      servingArea: 'Krishna & Guntur Districts',
      urgency: 'High',
      status: 'Active'
    },
    {
      id: 'NGO-002',
      ngoName: 'Food for All Trust',
      contactPerson: 'Mrs. Sunita Sharma',
      phone: '+91 98765 00002',
      email: 'sunita@foodforall.org',
      location: 'Anantapur, Anantapur',
      beneficiaries: 2000,
      requiredProduce: ['Grains', 'Fruits', 'Vegetables'],
      quantityNeeded: 500,
      servingArea: 'Anantapur District',
      urgency: 'Medium',
      status: 'Active'
    },
    {
      id: 'NGO-003',
      ngoName: 'Helping Hands Charitable Trust',
      contactPerson: 'Mr. Anil Kumar',
      phone: '+91 98765 00003',
      email: 'anil@helpinghands.org',
      location: 'Chittoor, Chittoor',
      beneficiaries: 3000,
      requiredProduce: ['All fresh produce'],
      quantityNeeded: 750,
      servingArea: 'Chittoor & Kadapa Districts',
      urgency: 'Critical',
      status: 'Active'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-500';
      case 'Reserved': return 'bg-yellow-500';
      case 'Picked': return 'bg-blue-500';
      case 'Delivered': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-500 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'Excellent': return '⭐⭐⭐';
      case 'Good': return '⭐⭐';
      case 'Fair': return '⭐';
      default: return '';
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesQuality = selectedQuality === 'all' || listing.quality === selectedQuality;
    const matchesState = selectedState === 'all' || listing.state === selectedState;
    const matchesSearch = searchQuery === '' || 
      listing.produce.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesQuality && matchesState && matchesSearch;
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
                <HeartHandshake className="h-16 w-16 text-green-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Food Surplus Redistribution
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Connect farmers with surplus produce to NGOs and charitable organizations. 
                Fight hunger, reduce food waste, earn tax benefits.
              </p>
              
              {/* Impact Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-green-600">1,500+</div>
                    <div className="text-sm text-gray-600">Tons Donated</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-blue-600">50,000+</div>
                    <div className="text-sm text-gray-600">People Fed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-purple-600">250+</div>
                    <div className="text-sm text-gray-600">Active Farmers</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-orange-600">35+</div>
                    <div className="text-sm text-gray-600">Partner NGOs</div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button
                variant={activeTab === 'listings' ? 'default' : 'outline'}
                onClick={() => setActiveTab('listings')}
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Available Donations ({listings.filter(l => l.status === 'Available').length})
              </Button>
              <Button
                variant={activeTab === 'ngos' ? 'default' : 'outline'}
                onClick={() => setActiveTab('ngos')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                NGO Requests ({ngoRequests.filter(n => n.status === 'Active').length})
              </Button>
              <Button
                variant={activeTab === 'donate' ? 'default' : 'outline'}
                onClick={() => setActiveTab('donate')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                List Surplus
              </Button>
              <Button
                variant={activeTab === 'request' ? 'default' : 'outline'}
                onClick={() => setActiveTab('request')}
                className="flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                Request Food (NGO)
              </Button>
            </div>

            {/* Available Donations Tab */}
            {activeTab === 'listings' && (
              <StaggerChildren>
                
                {/* Filters */}
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Search Produce</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search by produce or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Quality Filter</Label>
                        <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Qualities</SelectItem>
                            <SelectItem value="Excellent">⭐⭐⭐ Excellent</SelectItem>
                            <SelectItem value="Good">⭐⭐ Good</SelectItem>
                            <SelectItem value="Fair">⭐ Fair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>State Filter</Label>
                        <Select value={selectedState} onValueChange={setSelectedState}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All States</SelectItem>
                            <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                            <SelectItem value="Telangana">Telangana</SelectItem>
                            <SelectItem value="Karnataka">Karnataka</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Listings Grid */}
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
                              <CardTitle className="text-2xl">{listing.produce}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <MapPin className="h-4 w-4" />
                                {listing.location}
                              </CardDescription>
                            </div>
                            <Badge className={getStatusColor(listing.status)}>
                              {listing.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          
                          {/* Quantity & Quality */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-green-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-600">Quantity</div>
                              <div className="text-2xl font-bold text-green-600">
                                {listing.quantity} {listing.unit}
                              </div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <div className="text-sm text-gray-600">Quality</div>
                              <div className="text-xl font-bold text-blue-600">
                                {getQualityIcon(listing.quality)} {listing.quality}
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-gray-700 mb-4 text-sm">
                            {listing.description}
                          </p>

                          <Separator className="my-4" />

                          {/* Details */}
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Available from:</span>
                              <span className="font-semibold">{listing.availableFrom}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Use within:</span>
                              <Badge variant="outline" className="text-orange-600">
                                {listing.expiryDays} days
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Truck className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Transport:</span>
                              <span className="font-semibold">
                                {listing.transportAvailable ? '✅ Available' : '❌ Pickup only'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-600">Farmer:</span>
                              <span className="font-semibold">{listing.farmerName}</span>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1" 
                              disabled={listing.status !== 'Available'}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              {listing.status === 'Available' ? 'Claim Donation' : 'Reserved'}
                            </Button>
                            <Button variant="outline">
                              <Share2 className="h-4 w-4" />
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
                      No donations found matching your filters.
                    </CardContent>
                  </Card>
                )}
              </StaggerChildren>
            )}

            {/* NGO Requests Tab */}
            {activeTab === 'ngos' && (
              <StaggerChildren>
                <div className="grid grid-cols-1 gap-6">
                  {ngoRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-2xl flex items-center gap-2">
                                <Users className="h-6 w-6 text-blue-600" />
                                {request.ngoName}
                              </CardTitle>
                              <CardDescription className="mt-2">
                                Contact: {request.contactPerson} | {request.phone}
                              </CardDescription>
                            </div>
                            <Badge className={getUrgencyColor(request.urgency)}>
                              {request.urgency} Priority
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="text-sm text-gray-600 mb-1">Beneficiaries</div>
                              <div className="text-2xl font-bold text-blue-600">
                                {request.beneficiaries.toLocaleString()}
                              </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <div className="text-sm text-gray-600 mb-1">Quantity Needed</div>
                              <div className="text-2xl font-bold text-green-600">
                                {request.quantityNeeded} kg
                              </div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                              <div className="text-sm text-gray-600 mb-1">Serving Area</div>
                              <div className="text-lg font-bold text-purple-600">
                                {request.servingArea}
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <Label className="text-sm text-gray-600">Required Produce:</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {request.requiredProduce.map((produce, i) => (
                                <Badge key={i} variant="secondary">
                                  {produce}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <MapPin className="h-4 w-4" />
                            <span>{request.location}</span>
                          </div>

                          <Button className="w-full">
                            <Phone className="mr-2 h-4 w-4" />
                            Contact NGO
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </StaggerChildren>
            )}

            {/* List Surplus Form Tab */}
            {activeTab === 'donate' && (
              <Card>
                <CardHeader>
                  <CardTitle>List Your Surplus Produce</CardTitle>
                  <CardDescription>
                    Help fight hunger and reduce waste. Get tax benefits for your donation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div>
                        <Label htmlFor="produce">Produce Type *</Label>
                        <Input id="produce" placeholder="e.g., Tomatoes, Rice, Wheat" />
                      </div>

                      <div>
                        <Label htmlFor="quantity">Quantity *</Label>
                        <div className="flex gap-2">
                          <Input id="quantity" type="number" placeholder="500" className="flex-1" />
                          <Select defaultValue="kg">
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="tons">tons</SelectItem>
                              <SelectItem value="dozens">dozens</SelectItem>
                              <SelectItem value="units">units</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="quality">Quality *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">⭐⭐⭐ Excellent</SelectItem>
                            <SelectItem value="good">⭐⭐ Good</SelectItem>
                            <SelectItem value="fair">⭐ Fair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="expiry">Use Within (days) *</Label>
                        <Input id="expiry" type="number" placeholder="7" />
                      </div>

                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input id="location" placeholder="Village, District, State" />
                      </div>

                      <div>
                        <Label htmlFor="contact">Contact Number *</Label>
                        <Input id="contact" placeholder="+91 98765 43210" />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Describe the produce condition, storage, and any specific notes..."
                          rows={4}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="transport" className="rounded" />
                          <Label htmlFor="transport" className="font-normal">
                            I can provide transportation or delivery within 30km
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      <Plus className="mr-2 h-5 w-5" />
                      List Surplus Produce
                    </Button>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">💰 Tax Benefits</h4>
                      <p className="text-sm text-green-700">
                        Food donations are eligible for 50% tax deduction under Section 80G. 
                        You'll receive a donation certificate from the receiving NGO.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* NGO Request Form Tab */}
            {activeTab === 'request' && (
              <Card>
                <CardHeader>
                  <CardTitle>Submit Food Request (NGOs Only)</CardTitle>
                  <CardDescription>
                    Register your organization's food requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div>
                        <Label htmlFor="ngoName">NGO Name *</Label>
                        <Input id="ngoName" placeholder="Your organization name" />
                      </div>

                      <div>
                        <Label htmlFor="registration">Registration No. *</Label>
                        <Input id="registration" placeholder="12A/80G Registration" />
                      </div>

                      <div>
                        <Label htmlFor="contactPerson">Contact Person *</Label>
                        <Input id="contactPerson" placeholder="Full name" />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" placeholder="+91 98765 43210" />
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="contact@ngo.org" />
                      </div>

                      <div>
                        <Label htmlFor="ngoLocation">Location *</Label>
                        <Input id="ngoLocation" placeholder="City, District" />
                      </div>

                      <div>
                        <Label htmlFor="beneficiaries">Number of Beneficiaries *</Label>
                        <Input id="beneficiaries" type="number" placeholder="5000" />
                      </div>

                      <div>
                        <Label htmlFor="urgency">Urgency Level *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="critical">🔴 Critical</SelectItem>
                            <SelectItem value="high">🟠 High</SelectItem>
                            <SelectItem value="medium">🟡 Medium</SelectItem>
                            <SelectItem value="low">🟢 Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="requiredProduce">Required Produce Types *</Label>
                        <Input id="requiredProduce" placeholder="Rice, Dal, Vegetables (comma separated)" />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="servingArea">Serving Area *</Label>
                        <Input id="servingArea" placeholder="Districts or regions you serve" />
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      <AlertCircle className="mr-2 h-5 w-5" />
                      Submit Request
                    </Button>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">📋 Verification Required</h4>
                      <p className="text-sm text-blue-700">
                        NGOs must submit valid 12A/80G registration documents for verification. 
                        Approval typically takes 24-48 hours.
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

export default FoodDonation;


