// Data storage (in-memory during session)
let comments = [];
let currentRating = 0;

// DOM Elements
const commentForm = document.getElementById('comment-form');
const commentsList = document.getElementById('comments-list');
const totalCommentsEl = document.getElementById('total-comments');
const averageRatingEl = document.getElementById('average-rating');
const charCountEl = document.getElementById('char-count');
const selectedRatingEl = document.getElementById('selected-rating');

// Star Rating functionality
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.rating);
        updateStarDisplay();
        document.getElementById('rating').value = currentRating;
    });
});

function updateStarDisplay() {
    document.querySelectorAll('.star').forEach(star => {
        const rating = parseInt(star.dataset.rating);
        star.classList.toggle('active', rating <= currentRating);
    });
    selectedRatingEl.textContent = currentRating > 0 ? ${currentRating}/5 : 'None';
}

// Character count for comment textarea
document.getElementById('comment').addEventListener('input', function() {
    const count = this.value.length;
    charCountEl.textContent = count;
    
    if (count > 500) {
        charCountEl.style.color = '#e74c3c';
    } else if (count >= 10) {
        charCountEl.style.color = '#27ae60';
    } else {
        charCountEl.style.color = '#7f8c8d';
    }
});

// Form validation
function validateForm() {
    let isValid = true;
    
    // Name validation
    const name = document.getElementById('name').value.trim();
    const nameError = document.getElementById('name-error');
    if (name.length < 2 || name.length > 50) {
        nameError.textContent = 'Name should be between 2 and 50 characters';
        isValid = false;
    } else {
        nameError.textContent = '';
    }
    
    // Email validation (optional but validated if provided)
    const email = document.getElementById('email').value.trim();
    const emailError = document.getElementById('email-error');
    if (email && !isValidEmail(email)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    } else {
        emailError.textContent = '';
    }
    
    // Comment validation
    const comment = document.getElementById('comment').value.trim();
    const commentError = document.getElementById('comment-error');
    if (comment.length < 10 || comment.length > 500) {
        commentError.textContent = 'Comment should between 10 and 500 characters';
        isValid = false;
    } else {
        commentError.textContent = '';
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Form submission
commentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Create new comment object
    const newComment = {
        id: Date.now(),
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        comment: document.getElementById('comment').value.trim(),
        rating: currentRating,
        timestamp: new Date().toLocaleString()
    };
    
    // Add to comments array
    comments.push(newComment);
    
    // Reset form
    commentForm.reset();
    currentRating = 0;
    updateStarDisplay();
    charCountEl.textContent = '0';
    charCountEl.style.color = '#7f8c8d';
    
    // Update display
    updateStatistics();
    displayComments();
});

// Update statistics
function updateStatistics() {
    // Total comments
    totalCommentsEl.textContent = comments.length;
    
    // Average rating (only from comments with ratings)
    const ratings = comments.filter(comment => comment.rating > 0).map(comment => comment.rating);
    const average = ratings.length > 0 ? 
        (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1) : '0.0';
    averageRatingEl.textContent = average;
}

// Display comments
function displayComments() {
    if (comments.length === 0) {
        commentsList.innerHTML = '<div class="no-comments">No comments yet. Be the first to comment!</div>';
        return;
    }
    
    commentsList.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <div>
                    <span class="comment-author">${comment.name}</span>
                    ${comment.email ? <span class="comment-email"> (${comment.email})</span> : ''}
                </div>
                ${comment.rating > 0 ? <span class="comment-rating">Rating: ${comment.rating}/5</span> : ''}
            </div>
            <p class="comment-text">${comment.comment}</p>
            <small style="color: #95a5a6;">Posted on ${comment.timestamp}</small>
        </div>
    `).join('');
}

// Initialize
displayComments();
updateStatistics();