import * as React from 'react'
import { styled } from '@mui/material/styles';
import ToolsPanelListItemButton from '@craftercms/studio-ui/components/ToolsPanelListItemButton'

import {
  Dialog,
  DialogTitle,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Paper,
  Switch,
  FormControlLabel,
  Button
} from '@mui/material'

export interface ExampleComponentProps {
  text: string
}

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    }
  }
}))

const ReactComponent = ({}: ExampleComponentProps) => {

  

  React.useEffect(() => {
    if(!document.getElementById("se1")) {
      // gross
      // @ts-ignore
      let siteId = craftercms.plugins.get("org.rd.plugin.awsmediaconvertconsole").source.site

      // @ts-ignore
      var baseAddress = "/studio/1/plugin/file"
                      + "?type=apps"
                      + "&name=awsmediaconvertconsole"
                      + "&pluginId=org.rd.plugin.awsmediaconvertconsole"
                      + "&siteId="+siteId
      
      var se1 = document.createElement("script")
          se1.src = baseAddress+"&filename=video.js"
          se1.id = "se1"
          document.head.appendChild(se1)
      var se2 = document.createElement("script")
          se2.src = baseAddress+"&filename=videojs-dash.js"
          document.head.appendChild(se2)
    }


    dataLoadChannels()
    
    var intervalRef = setInterval( () => {
        dataLoadChannels()
      },10000)
      return function() {
        clearInterval(intervalRef)
      }

  }, [])

  const dataLoadChannels = () => {
    // @ts-ignore
    let siteId = craftercms.plugins.get("org.rd.plugin.awsmediaconvertconsole").source.site
    // @ts-ignore
    let serviceUrl = '/studio/api/2/plugin/script/plugins/org/rd/plugin/awsmediaconvertconsole/mediaconvertconsole/list.json'
                   + '?siteId='+siteId
    
    // @ts-ignore
    CrafterCMSNext.util.ajax.get(serviceUrl).subscribe((response) => {
       setState({...state, channels:response.response.result})
    })
  }

  const handleToggleOn = (channelId) => {
    // @ts-ignore
    let siteId = craftercms.plugins.get("org.rd.plugin.awsmediaconvertconsole").source.site
    // @ts-ignore
    let serviceUrl = '/studio/api/2/plugin/script/plugins/org/rd/plugin/awsmediaconvertconsole/mediaconvertconsole/control.json'
                   + '?siteId='+siteId
                   + '&action=start'
                   + '&channelId='+channelId
    // @ts-ignore
    CrafterCMSNext.util.ajax.get(serviceUrl).subscribe((response) => {
        dataLoadChannels()
    })
  }

  const handleToggleOff = (channelId) => {
    // @ts-ignore
    let siteId = craftercms.plugins.get("org.rd.plugin.awsmediaconvertconsole").source.site
    // @ts-ignore
    let serviceUrl = '/studio/api/2/plugin/script/plugins/org/rd/plugin/awsmediaconvertconsole/mediaconvertconsole/control.json'
                   + '?siteId='+siteId
                   + '&action=stop'
                   + '&channelId='+channelId
    // @ts-ignore
    CrafterCMSNext.util.ajax.get(serviceUrl).subscribe((response) => {
        dataLoadChannels()
    })
  }

  const handleToggleChannel = (currentState, channelId) => {
    if(!currentState || currentState == false) {
      handleToggleOn(channelId)
    }
    else {
      handleToggleOff(channelId)
    }

  }

  const closePreview = () => {
    // @ts-ignore
    var playerEl = document.getElementById('example-video')
    // @ts-ignore
    videojs(playerEl).dispose()
    // @ts-ignore
    window.awsMPVideoPlayer = null
       
    setLightBoxOpen(false)
  }

  const previewDestination = (videoSrcUrl) => {

    setLightBoxOpen(open)

    window.setTimeout(function() {
      // @ts-ignore
      var player = window.awsMPVideoPlayer  
      
      if(!player) {
        // @ts-ignore
        var playerEl = document.getElementById('example-video')
        // @ts-ignore
        var player = videojs(playerEl)
        // @ts-ignore
        window.awsMPVideoPlayer = player
      }
      
      // @ts-ignore
      var videoType = (videoSrcUrl.indexOf("m3u8")!=-1) ? 'application/vnd.apple.mpegurl' :'application/dash+xml'
      player.src({ src: videoSrcUrl, type: videoType})
      player.play()        
   
    }, 1500)

  }

  const [open, setOpen] = React.useState(false)
  const [lightBoxOpen, setLightBoxOpen] = React.useState(false)

  const [state, setState] = React.useState({
    channels: {},
    hasMore: true,
    curPage: 0,
    itemsPerPage: 10,
    itemSize: 1
  })


  return (
    <React.Fragment>

      <ToolsPanelListItemButton icon={{id: "@mui/icons-material/VideocamOutlined"  }} 
                                title="AWS MediaConvert Jobs"  
                                onClick={() => setOpen(true)}/>

      <Dialog fullWidth={false} maxWidth={'lg'} onClose={() => closePreview()} open={lightBoxOpen}>
        <video id="example-video" style={{width:600, height:300}} className="video-js vjs-default-skin" controls> </video>
      </Dialog>

      <Dialog
        fullWidth={true}
        maxWidth={'xl'}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-dialog-title"
        open={open}>

        <DialogTitle id="max-width-dialog-title">
          AWS MediaConvert Jobs
        </DialogTitle>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">ID</TableCell>
                <TableCell align="right">State</TableCell>
                <TableCell align="right">Control</TableCell>
                <TableCell align="right">Preview</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
        { state.channels && Object.entries(state.channels as any).map(([channelIdx]) => {
            let channel = state.channels[channelIdx]
            let channelSwitchOn = (channel.state == "STARTING" || channel.state == "RUNNING")

            let d = Object.entries(channel.destinations as any).map(([destIdx]) => {
              let dest = channel.destinations[destIdx]

              let epb = Object.entries(dest.endpoints as any).map(([endpointsIdx]) => {
                let endpoint = dest.endpoints[endpointsIdx]
                let buttonLabel = (endpoint.description) ? endpoint.description : endpoint.description
                let button = (<div style={{ display: 'block' }}><Button size="small" color="primary" onClick={() => previewDestination(endpoint.url)}>{buttonLabel}</Button></div>)
                return button
              })
            
              return (<tr>
                       <td><b>{dest.mediaPackageChannelId}</b></td>
                       <td>&nbsp;</td>
                       <td>&nbsp;</td>
                       <td>&nbsp;</td>
                       <td>{epb}</td>
                     </tr>)
            })
            
            let channelPreviewButton = <table>{d}</table>

            // @ts-ignore
            return(
              <TableRow
                key={channel.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="left"><b>{channel.name}</b></TableCell>
                <TableCell align="right">{channel.id}</TableCell>
                <TableCell align="right">{channel.state}</TableCell>
                <TableCell align="right">
                  <FormControlLabel
                    checked={channelSwitchOn}
                    onChange={() => handleToggleChannel(channelSwitchOn, channel.id)}
                    control={<IOSSwitch  />}
                    label=""/> 
                </TableCell>
                <TableCell align="right">{channelPreviewButton}</TableCell>
              </TableRow>
            )
          })
        }
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
    </React.Fragment>
  )
}

export default ReactComponent
