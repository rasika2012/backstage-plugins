import { Drawer, Button, Typography, Box, useTheme, IconButton, CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import { WorkloadEditor } from './WorkloadEditor';
import CloseIcon from '@material-ui/icons/Close';
import { ModelsWorkload } from '@internal/plugin-openchoreo-api';
import { applyWorkload, fetchWorkloadInfo } from '../../../api/workloadInfo';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';
import { discoveryApiRef } from '@backstage/core-plugin-api';
import { identityApiRef } from '@backstage/core-plugin-api';
import { Alert } from '@material-ui/lab';

export function Workload() {
    const discovery = useApi(discoveryApiRef);
    const identity = useApi(identityApiRef);
    const { entity } = useEntity();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [workloadSpec, setWorkloadSpec] = React.useState<ModelsWorkload | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        const fetchWorkload = async () => {
            try {
                setIsLoading(true);
                const response = await fetchWorkloadInfo(entity, discovery, identity);
                setWorkloadSpec(response);
                setIsLoading(false);
            } catch (e) {
                setError('Failed to fetch workload info');
            }
        }
        fetchWorkload();
        return () => {
            setWorkloadSpec(null);
            setError(null);
        }
    }, [entity, discovery, identity]);

    const toggleDrawer = () => (event: React.KeyboardEvent | React.MouseEvent) => {
        setOpen(!open);
    }

    const handleWorkloadSpecChange = (spec: ModelsWorkload) => {
        setWorkloadSpec(spec);
        // You can add additional logic here to save the workload spec or pass it to parent components
    };

    const handleDeploy = async () => {
        if (!workloadSpec) {
            return;
        }
        const response = await applyWorkload(entity, discovery, identity, workloadSpec);
    };

    return (
        <>
            <Box display="flex" justifyContent="space-between" flexDirection="column" gridGap={8}>
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                    {isLoading && !error && <CircularProgress />}
                </Box>
                {error && <Alert severity="error">{error}</Alert>}
                <Button onClick={toggleDrawer()} disabled={!!error} variant="contained" color="primary" startIcon={<SettingsIcon />}>
                    Configure & Deploy
                </Button>
            </Box>

            <Drawer open={open} onClose={toggleDrawer()} anchor="right">
                <Box
                    bgcolor={theme.palette.grey[200]}
                    minWidth={theme.spacing(80)}
                    display="flex"
                    flexDirection="column"
                    height="100%"
                    overflow="hidden"
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                        <Typography variant="h6" component="h4">
                            Configure Workload
                        </Typography>
                        <IconButton onClick={toggleDrawer()} color="default">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box
                        borderBottom={1}
                        borderColor="grey.400"
                    />
                    <Box flex={1} paddingBottom={2} overflow="auto" bgcolor="grey.200">
                        <WorkloadEditor
                            onDeploy={handleDeploy}
                            workloadSpec={workloadSpec}
                            onWorkloadSpecChange={handleWorkloadSpecChange}
                        />
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}   