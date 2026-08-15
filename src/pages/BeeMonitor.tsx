import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Flower2, 
  Activity, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Download
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { StaggerContainer, StaggerItem } from '@/components/StaggerChildren';

interface HiveInspection {
  id: string;
  hiveId: string;
  date: string;
  beePopulation: string;
  queenPresent: boolean;
  broodPattern: string;
  honeyStores: string;
  pollenStores: string;
  pestsDiseases: string[];
  temperament: string;
  overallHealth: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  actionsTaken: string;
  nextInspection: string;
}

const BeeMonitor = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'hives' | 'inspect' | 'alerts'>('dashboard');

  const [hives] = useState([
    {
      id: 'HIVE-001',
      name: 'Colony Alpha',
      location: 'North Apiary',
      installDate: '2025-03-15',
      status: 'Excellent',
      population: '40,000-50,000',
      lastInspection: '2026-08-10',
      honeyProduction: '45 kg',
      alerts: 0
    },
    {
      id: 'HIVE-002',
      name: 'Colony Beta',
      location: 'South Apiary',
      installDate: '2025-04-20',
      status: 'Good',
      population: '30,000-40,000',
      lastInspection: '2026-08-08',
      honeyProduction: '38 kg',
      alerts: 1
    },
    {
      id: 'HIVE-003',
      name: 'Colony Gamma',
      location: 'East Apiary',
      installDate: '2025-05-10',
      status: 'Fair',
      population: '20,000-30,000',
      lastInspection: '2026-08-05',
      honeyProduction: '25 kg',
      alerts: 2
    }
  ]);

  const [inspections] = useState<HiveInspection[]>([
    {
      id: 'INS-001',
      hiveId: 'HIVE-001',
      date: '2026-08-10',
      beePopulation: 'Strong (40,000-50,000)',
      queenPresent: true,
      broodPattern: 'Excellent - solid pattern',
      honeyStores: 'Abundant - 8 frames',
      pollenStores: 'Good - 3 frames',
      pestsDiseases: ['None detected'],
      temperament: 'Calm and gentle',
      overallHealth: 'Excellent',
      actionsTaken: 'Added honey super. Hive is ready for harvest soon.',
      nextInspection: '2026-08-24'
    },
    {
      id: 'INS-002',
      hiveId: 'HIVE-002',
      date: '2026-08-08',
      beePopulation: 'Moderate (30,000-40,000)',
      queenPresent: true,
      broodPattern: 'Good - some gaps',
      honeyStores: 'Adequate - 5 frames',
      pollenStores: 'Fair - 2 frames',
      pestsDiseases: ['Varroa mites detected (low)'],
      temperament: 'Slightly defensive',
      overallHealth: 'Good',
      actionsTaken: 'Applied mite treatment. Will monitor closely.',
      nextInspection: '2026-08-15'
    }
  ]);

  const [alerts] = useState([
    {
      id: 'ALR-001',
      hiveId: 'HIVE-003',
      severity: 'High',
      type: 'Population Decline',
      message: 'Population dropped 30% in last 2 weeks',
      date: '2026-08-14',
      action: 'Check for queen issues, consider requeening'
    },
    {
      id: 'ALR-002',
      hiveId: 'HIVE-002',
      severity: 'Medium',
      type: 'Varroa Mites',
      message: 'Mite levels above threshold (3%)',
      date: '2026-08-12',
      action: 'Treatment applied, re-check in 1 week'
    },
    {
      id: 'ALR-003',
      hiveId: 'HIVE-003',
      severity: 'High',
      type: 'Low Food Stores',
      message: 'Honey and pollen stores critically low',
      date: '2026-08-11',
      action: 'Emergency feeding required'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'bg-green-500';
      case 'Good': return 'bg-blue-500';
      case 'Fair': return 'bg-yellow-500';
      case 'Poor': return 'bg-orange-500';
      case 'Critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };


  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

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
                <Flower2 className="h-16 w-16 text-yellow-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Bee Colony Health Monitor
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Prevent colony collapse with systematic hive monitoring, 
                health tracking, and early warning alerts.
              </p>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setActiveTab('dashboard')}
              >
                Overview
              </Button>
              <Button
                variant={activeTab === 'hives' ? 'default' : 'outline'}
                onClick={() => setActiveTab('hives')}
              >
                My Hives ({hives.length})
              </Button>
              <Button
                variant={activeTab === 'inspect' ? 'default' : 'outline'}
                onClick={() => setActiveTab('inspect')}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Inspection
              </Button>
              <Button
                variant={activeTab === 'alerts' ? 'default' : 'outline'}
                onClick={() => setActiveTab('alerts')}
                className="relative"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Alerts ({alerts.length})
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {alerts.length}
                  </span>
                )}
              </Button>
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <StaggerChildren>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600">Total Hives</div>
                          <div className="text-3xl font-bold text-blue-600">{hives.length}</div>
                        </div>
                        <Activity className="h-10 w-10 text-blue-600 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600">Healthy Hives</div>
                          <div className="text-3xl font-bold text-green-600">
                            {hives.filter(h => h.status === 'Excellent' || h.status === 'Good').length}
                          </div>
                        </div>
                        <CheckCircle2 className="h-10 w-10 text-green-600 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600">Active Alerts</div>
                          <div className="text-3xl font-bold text-red-600">{alerts.length}</div>
                        </div>
                        <AlertTriangle className="h-10 w-10 text-red-600 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-600">Honey Produced</div>
                          <div className="text-3xl font-bold text-yellow-600">108 kg</div>
                        </div>
                        <TrendingUp className="h-10 w-10 text-yellow-600 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Inspections */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Recent Inspections</CardTitle>
                    <CardDescription>Latest hive health assessments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {inspections.map((inspection) => (
                        <div key={inspection.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-semibold">{inspection.hiveId}</div>
                              <div className="text-sm text-gray-600">{inspection.date}</div>
                            </div>
                            <Badge className={getStatusColor(inspection.overallHealth)}>
                              {inspection.overallHealth}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                            <div>
                              <span className="text-gray-600">Queen:</span>{' '}
                              {inspection.queenPresent ? 
                                <span className="text-green-600">✓ Present</span> : 
                                <span className="text-red-600">✗ Missing</span>
                              }
                            </div>
                            <div>
                              <span className="text-gray-600">Population:</span> {inspection.beePopulation}
                            </div>
                            <div>
                              <span className="text-gray-600">Honey:</span> {inspection.honeyStores}
                            </div>
                            <div>
                              <span className="text-gray-600">Pollen:</span> {inspection.pollenStores}
                            </div>
                          </div>

                          {inspection.pestsDiseases.length > 0 && inspection.pestsDiseases[0] !== 'None detected' && (
                            <div className="bg-orange-50 border border-orange-200 rounded p-2 text-sm">
                              <strong className="text-orange-800">Issues:</strong> {inspection.pestsDiseases.join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Health Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle>🐝 Colony Collapse Prevention Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold">Regular Inspections</div>
                            <div className="text-sm text-gray-600">Check every 7-10 days during active season</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold">Varroa Mite Control</div>
                            <div className="text-sm text-gray-600">Monitor and treat mite levels monthly</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold">Adequate Nutrition</div>
                            <div className="text-sm text-gray-600">Ensure diverse pollen and nectar sources</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold">Queen Quality</div>
                            <div className="text-sm text-gray-600">Replace queens every 2-3 years</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold">Pesticide Awareness</div>
                            <div className="text-sm text-gray-600">Monitor nearby agricultural chemical use</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold">Stress Reduction</div>
                            <div className="text-sm text-gray-600">Minimize disturbance and temperature fluctuations</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </StaggerChildren>
            )}


            {/* My Hives Tab */}
            {activeTab === 'hives' && (
              <StaggerChildren>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {hives.map((hive, index) => (
                    <motion.div
                      key={hive.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{hive.name}</CardTitle>
                              <CardDescription>{hive.id}</CardDescription>
                            </div>
                            <Badge className={getStatusColor(hive.status)}>
                              {hive.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm text-gray-600">Location</div>
                              <div className="font-semibold">{hive.location}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Population</div>
                              <div className="font-semibold">{hive.population} bees</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Honey Production</div>
                              <div className="font-semibold text-yellow-600">{hive.honeyProduction}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Last Inspection</div>
                              <div className="font-semibold">{hive.lastInspection}</div>
                            </div>
                            {hive.alerts > 0 && (
                              <div className="bg-red-50 border border-red-200 rounded p-2">
                                <div className="flex items-center gap-2 text-red-700">
                                  <AlertTriangle className="h-4 w-4" />
                                  <span className="text-sm font-semibold">{hive.alerts} Active Alert(s)</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <Separator className="my-4" />
                          <Button className="w-full">View Details</Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </StaggerChildren>
            )}

            {/* Inspection Form Tab */}
            {activeTab === 'inspect' && (
              <Card>
                <CardHeader>
                  <CardTitle>New Hive Inspection</CardTitle>
                  <CardDescription>Record detailed hive health assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Hive ID *</Label>
                        <Input placeholder="HIVE-001" />
                      </div>
                      <div>
                        <Label>Inspection Date *</Label>
                        <Input type="date" defaultValue="2026-08-15" />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold text-lg mb-4">🐝 Population Assessment</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Queen Present? *</Label>
                          <div className="flex gap-4 mt-2">
                            <label className="flex items-center gap-2">
                              <input type="radio" name="queen" value="yes" />
                              <span>✓ Yes</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="radio" name="queen" value="no" />
                              <span>✗ No</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input type="radio" name="queen" value="unsure" />
                              <span>? Unsure</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <Label>Population Strength *</Label>
                          <Input placeholder="e.g., Strong (40,000-50,000)" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold text-lg mb-4">🍯 Stores Assessment</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Honey Stores *</Label>
                          <Input placeholder="e.g., Abundant - 8 frames" />
                        </div>
                        <div>
                          <Label>Pollen Stores *</Label>
                          <Input placeholder="e.g., Good - 3 frames" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold text-lg mb-4">🔬 Health Check</h3>
                      <div className="space-y-4">
                        <div>
                          <Label>Brood Pattern *</Label>
                          <Input placeholder="e.g., Excellent - solid pattern" />
                        </div>
                        <div>
                          <Label>Pests/Diseases Detected</Label>
                          <Input placeholder="e.g., Varroa mites (low), None detected" />
                        </div>
                        <div>
                          <Label>Temperament *</Label>
                          <Input placeholder="e.g., Calm and gentle, Slightly defensive" />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label>Actions Taken</Label>
                      <textarea 
                        className="w-full border rounded p-2 min-h-[100px]"
                        placeholder="Describe any actions taken during inspection..."
                      />
                    </div>

                    <div>
                      <Label>Next Inspection Date *</Label>
                      <Input type="date" />
                    </div>

                    <Button className="w-full" size="lg">
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Save Inspection Report
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
              <StaggerChildren>
                <div className="space-y-4">
                  {alerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-l-4 border-red-500">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                              <div>
                                <div className="font-semibold text-lg">{alert.type}</div>
                                <div className="text-sm text-gray-600">{alert.hiveId} • {alert.date}</div>
                              </div>
                            </div>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </div>
                          
                          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                            <p className="text-red-800">{alert.message}</p>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                            <div className="font-semibold text-blue-800 text-sm mb-1">Recommended Action:</div>
                            <p className="text-blue-700 text-sm">{alert.action}</p>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Mark Resolved
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              View Hive Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </StaggerChildren>
            )}

          </div>
        </div>
      </PageTransition>
      );
};

export default BeeMonitor;


