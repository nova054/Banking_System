import React from 'react';
import { useInterfaceMode } from '@/contexts/InterfaceModeContext';
import { Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const InterfaceModeToggle: React.FC = () => {
  const { isAdminMode, toggleMode } = useInterfaceMode();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMode}
            className="flex items-center gap-2 h-9 px-3"
          >
            {isAdminMode ? (
              <>
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">User View</span>
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Admin View</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isAdminMode 
              ? 'Switch to User Experience (same features for all users)' 
              : 'Switch to Admin Experience (admin-specific interface)'
            }
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
