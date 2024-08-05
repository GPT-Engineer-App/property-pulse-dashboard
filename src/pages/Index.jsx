import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Building2, TrendingUp, DollarSign, PieChart, Upload } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const initialPropertyData = [
  { id: 1, address: "123 Main St", value: 250000, rent: 1500 },
  { id: 2, address: "456 Elm St", value: 300000, rent: 1800 },
  { id: 3, address: "789 Oak St", value: 280000, rent: 1600 },
];

const performanceData = [
  { month: 'Jan', revenue: 5000, expenses: 3000 },
  { month: 'Feb', revenue: 5200, expenses: 3100 },
  { month: 'Mar', revenue: 5400, expenses: 3200 },
  { month: 'Apr', revenue: 5600, expenses: 3300 },
  { month: 'May', revenue: 5800, expenses: 3400 },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [propertyData, setPropertyData] = useState(initialPropertyData);

  const totalValue = propertyData.reduce((sum, property) => sum + property.value, 0);
  const totalRent = propertyData.reduce((sum, property) => sum + property.rent, 0);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      complete: (results) => {
        const parsedData = results.data.slice(1).map((row, index) => ({
          id: index + 1,
          address: row[0],
          value: parseFloat(row[1]),
          rent: parseFloat(row[2]),
        }));
        setPropertyData(parsedData);
        toast.success("CSV file uploaded and processed successfully!");
      },
      header: true,
      skipEmptyLines: true,
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.csv' });

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Real Estate Investment Dashboard</h1>
      
      <div {...getRootProps()} className="mb-8 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the CSV file here ...</p>
        ) : (
          <div>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p>Drag 'n' drop a CSV file here, or click to select one</p>
            <p className="text-sm text-gray-500">
              (CSV should have columns: address, value, rent)
            </p>
          </div>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{propertyData.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Rent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRent.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROI</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{((totalRent * 12 / totalValue) * 100).toFixed(2)}%</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="properties">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Property Listings</CardTitle>
              <Button
                onClick={() => setPropertyData(initialPropertyData)}
                variant="outline"
              >
                Reset to Default Data
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {propertyData.map(property => (
                  <Card key={property.id}>
                    <CardContent className="flex justify-between items-center p-4">
                      <div>
                        <h3 className="font-semibold">{property.address}</h3>
                        <p className="text-sm text-muted-foreground">Value: ${property.value.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Rent: ${property.rent}/month</p>
                        <p className="text-sm text-muted-foreground">
                          ROI: {((property.rent * 12 / property.value) * 100).toFixed(2)}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Investment Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
