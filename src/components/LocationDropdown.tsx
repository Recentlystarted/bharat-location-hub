import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  ChevronDown, 
  MapPin, 
  Building2, 
  Globe,
  Navigation,
  Search,
  RefreshCw,
  ExternalLink,
  Check
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface State {
  name: string;
  code: string;
  districts: number;
  talukas?: number;
  villages?: number;
}

interface LocationDropdownProps {
  onLocationSelect?: (location: any) => void;
  className?: string;
}

export default function LocationDropdown({ onLocationSelect, className = "" }: LocationDropdownProps) {
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [talukas, setTalukas] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);
  
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedTaluka, setSelectedTaluka] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  
  const [loadingStates, setLoadingStates] = useState<string>(''); // tracks what's loading
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load states on component mount
  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = async () => {
    setLoadingStates('states');
    try {
      // Load states from the JSON API
      const response = await fetch('/api/states.json');
      if (response.ok) {
        const data = await response.json();
        if (data.states) {
          setStates(data.states);
        }
      }
      setIsInitialLoad(false);
    } catch (error) {
      console.error('Failed to load states:', error);
    } finally {
      setLoadingStates('');
    }
  };

  const loadDistrictsFromData = async (stateName: string) => {
    setLoadingStates('districts');
    setDistricts([]);
    setTalukas([]);
    setVillages([]);
    setSelectedDistrict('');
    setSelectedTaluka('');
    setSelectedVillage('');
    
    try {
      // Convert state name to filename format
      const filename = stateName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const response = await fetch(`/api/states/${filename}.json`);
      if (response.ok) {
        const stateData = await response.json();
        
        // Extract district names from the state data
        const districtNames = stateData.districts?.map((district: any) => district.name).sort() || [];
        
        setDistricts(districtNames);
      } else {
        console.error('Failed to load state file:', response.status);
      }
    } catch (error) {
      console.error('Failed to load districts:', error);
    } finally {
      setLoadingStates('');
    }
  };

  const loadTalukasFromData = async (stateName: string, districtName: string) => {
    setLoadingStates('talukas');
    setTalukas([]);
    setVillages([]);
    setSelectedTaluka('');
    setSelectedVillage('');
    
    try {
      const filename = stateName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const response = await fetch(`/api/states/${filename}.json`);
      if (response.ok) {
        const stateData = await response.json();
        
        // Find the district and get its talukas
        const district = stateData.districts?.find((d: any) => 
          d.name.toLowerCase() === districtName.toLowerCase()
        );
        
        if (district && district.talukas) {
          const talukaNames = district.talukas.map((taluka: any) => taluka.name).sort();
          setTalukas(talukaNames);
        }
      }
    } catch (error) {
      console.error('Failed to load talukas:', error);
    } finally {
      setLoadingStates('');
    }
  };

  const loadVillagesFromData = async (stateName: string, districtName: string, talukaName: string) => {
    setLoadingStates('villages');
    setVillages([]);
    setSelectedVillage('');
    
    try {
      const filename = stateName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const response = await fetch(`/api/states/${filename}.json`);
      if (response.ok) {
        const stateData = await response.json();
        
        // Find the district
        const district = stateData.districts?.find((d: any) => 
          d.name.toLowerCase() === districtName.toLowerCase()
        );
        
        if (district && district.talukas) {
          // Find the taluka
          const taluka = district.talukas.find((t: any) => 
            t.name.toLowerCase() === talukaName.toLowerCase()
          );
          
          if (taluka && taluka.villages) {
            const villageNames = taluka.villages.map((village: any) => village.name).sort();
            setVillages(villageNames);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load villages:', error);
    } finally {
      setLoadingStates('');
    }
  };

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    if (stateName) {
      loadDistrictsFromData(stateName);
    } else {
      setDistricts([]);
      setTalukas([]);
      setVillages([]);
      setSelectedDistrict('');
      setSelectedTaluka('');
      setSelectedVillage('');
    }
  };

  const handleDistrictChange = (districtName: string) => {
    setSelectedDistrict(districtName);
    if (districtName && selectedState) {
      loadTalukasFromData(selectedState, districtName);
    } else {
      setTalukas([]);
      setVillages([]);
      setSelectedTaluka('');
      setSelectedVillage('');
    }
  };

  const handleTalukaChange = (talukaName: string) => {
    setSelectedTaluka(talukaName);
    if (talukaName && selectedState && selectedDistrict) {
      loadVillagesFromData(selectedState, selectedDistrict, talukaName);
    } else {
      setVillages([]);
      setSelectedVillage('');
    }
  };

  const handleVillageChange = (villageName: string) => {
    setSelectedVillage(villageName);
    
    // Callback with complete location info
    if (onLocationSelect && villageName) {
      onLocationSelect({
        state: selectedState,
        district: selectedDistrict,
        taluka: selectedTaluka,
        village: villageName,
        fullPath: `${villageName}, ${selectedTaluka}, ${selectedDistrict}, ${selectedState}`
      });
    }
  };

  const resetSelection = () => {
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedTaluka('');
    setSelectedVillage('');
    setDistricts([]);
    setTalukas([]);
    setVillages([]);
  };

  // Searchable Select Component using Command
  const SearchableSelect = ({ 
    title, 
    icon: Icon, 
    options, 
    value, 
    onChange, 
    disabled, 
    loading, 
    placeholder,
    type = 'string'
  }: {
    title: string;
    icon: any;
    options: string[] | State[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    loading?: boolean;
    placeholder: string;
    type?: 'string' | 'state';
  }) => {
    const [open, setOpen] = useState(false);

    return (
      <Card className={`${disabled ? 'opacity-50' : 'hover:shadow-md transition-shadow'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Icon className="h-4 w-4 text-primary" />
            <span>{title}</span>
            {loading && <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                disabled={disabled || loading}
              >
                {value
                  ? (type === 'state' 
                      ? (options as State[]).find((option) => option.name === value)?.name
                      : value)
                  : placeholder}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
              <Command>
                <CommandInput placeholder={`Search ${title.toLowerCase()}...`} />
                <CommandEmpty>No {title.toLowerCase()} found.</CommandEmpty>
                <CommandGroup className="max-h-60 overflow-auto">
                  {options.map((option) => {
                    const optionValue = type === 'state' ? (option as State).name : (option as string);
                    const optionLabel = type === 'state' ? (option as State).name : (option as string);
                    const optionExtra = type === 'state' ? ` (${(option as State).districts} districts)` : '';
                    
                    return (
                      <CommandItem
                        key={optionValue}
                        onSelect={() => {
                          onChange(optionValue === value ? "" : optionValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === optionValue ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{optionLabel}</div>
                          {optionExtra && (
                            <div className="text-xs text-muted-foreground">{optionExtra}</div>
                          )}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {value && type === 'state' && (
            <div className="mt-2 text-xs text-muted-foreground">
              {(options.find((s: any) => s.name === value) as any)?.districts} districts available
            </div>
          )}
          {value && type === 'string' && options.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              {options.length} {title.toLowerCase()} available
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Location Hierarchy Selector
        </h2>
        <p className="text-muted-foreground mb-4">
          Select location hierarchically: State → District → Taluka → Village
        </p>
        {(selectedState || selectedDistrict || selectedTaluka || selectedVillage) && (
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Current Selection: {[selectedState, selectedDistrict, selectedTaluka, selectedVillage].filter(Boolean).join(' → ')}
            </Badge>
            <Button size="sm" variant="ghost" onClick={resetSelection}>
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* States */}
        <SearchableSelect
          title="State / Union Territory"
          icon={Globe}
          options={states}
          value={selectedState}
          onChange={handleStateChange}
          loading={loadingStates === 'states' || isInitialLoad}
          placeholder="Select State"
          type="state"
        />

        {/* Districts */}
        <SearchableSelect
          title="District"
          icon={Building2}
          options={districts}
          value={selectedDistrict}
          onChange={handleDistrictChange}
          disabled={!selectedState}
          loading={loadingStates === 'districts'}
          placeholder={selectedState ? "Select District" : "Choose state first"}
          type="string"
        />

        {/* Talukas */}
        <SearchableSelect
          title="Taluka / Sub-district"
          icon={Navigation}
          options={talukas}
          value={selectedTaluka}
          onChange={handleTalukaChange}
          disabled={!selectedDistrict}
          loading={loadingStates === 'talukas'}
          placeholder={selectedDistrict ? "Select Taluka" : "Choose district first"}
          type="string"
        />

        {/* Villages */}
        <SearchableSelect
          title="Village / City"
          icon={MapPin}
          options={villages}
          value={selectedVillage}
          onChange={handleVillageChange}
          disabled={!selectedTaluka}
          loading={loadingStates === 'villages'}
          placeholder={selectedTaluka ? "Select Village" : "Choose taluka first"}
          type="string"
        />
      </div>

      {/* Selection Summary */}
      {selectedVillage && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">Selected Location</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Village:</span>
                    <span className="font-medium">{selectedVillage}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Taluka:</span>
                    <span>{selectedTaluka}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">District:</span>
                    <span>{selectedDistrict}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">State:</span>
                    <span>{selectedState}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs text-muted-foreground">Full Address:</div>
                  <div className="font-mono text-sm text-foreground bg-background p-2 rounded border mt-1">
                    {selectedVillage}, {selectedTaluka}, {selectedDistrict}, {selectedState}, India
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Information */}
      <Card className="bg-secondary/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Search className="h-5 w-5 text-primary" />
            <span>How This Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">API Endpoints Used:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li><code>/api/states</code> - Get all states</li>
                <li><code>/api/states/[state]/districts</code> - Get districts</li>
                <li><code>/api/districts/[district]/talukas</code> - Get talukas</li>
                <li><code>/api/talukas/[taluka]/villages</code> - Get villages</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Features:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Hierarchical data loading</li>
                <li>• Auto-cascading dropdowns</li>
                <li>• Loading states & error handling</li>
                <li>• Mobile-responsive design</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
