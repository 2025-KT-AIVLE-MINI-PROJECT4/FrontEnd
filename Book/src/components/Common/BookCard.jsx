import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
// import CardActions from '@mui/material/CardActions';

function BookCard(props) {
  return (
    <Card sx={{ maxWidth: 180 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="120"
          image="https://cdn.dailyvet.co.kr/wp-content/uploads/2024/05/15231604/20240515ceva_experts2.jpg"
          alt="Test Image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            책 제목 {props.testIdx}<br/>
            <Chip variant="outlined" color="secondary" size="small" 
            label="카테고리"/>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            작가명 <br />
            등록일
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default BookCard;